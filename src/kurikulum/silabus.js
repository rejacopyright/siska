import React from 'react';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import con from '../api/connection';
import { Scrollbars } from 'react-custom-scrollbars';
import Input from '../misc/input';
import Select from '../misc/select';
import Modal from '../misc/modal';

class Silabus extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      silabus:[],
      silabus_page:1,
      silabus_search:'',
      silabus_self:{mapel:{}, kelas:{}, semester:{}},
      loading:true
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Silabus';
    this._isMounted && axios.get(con.api+'/kurikulum/silabus', {headers:con.headers, params:{page:this.state.silabus_page}})
    .then(res => {
      this.setState({ silabus:res.data.silabus, loading:false });
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  add(e){
    e.preventDefault();
    const q = {};
    q['mapel_id'] = this.addForm.querySelector('select[name="mapel_id"]').value;
    q['kelas_id'] = this.addForm.querySelector('select[name="kelas_id"]').value;
    q['semester_id'] = this.addForm.querySelector('select[name="semester_id"]').value;
    q['sk'] = this.addForm.querySelector('input[name="sk"]').value;
    let allFilled = Object.values(q).every((i) => i !== "");
    if (allFilled) {
      axios.post(con.api+'/kurikulum/silabus/store', q, {headers:con.headers})
      .then(res => {
        this.setState({ silabus:res.data.silabus, silabus_page:1 });
        document.getElementById('table-silabus').parentElement.scrollTo(0,0);
      });
    }
  }
  edit(e){
    e.preventDefault();
    const q = {silabus_id:this.state.silabus_self.silabus_id};
    q['mapel_id'] = this.editForm.querySelector('select[name="mapel_id"]').value;
    q['kelas_id'] = this.editForm.querySelector('select[name="kelas_id"]').value;
    q['semester_id'] = this.editForm.querySelector('select[name="semester_id"]').value;
    q['sk'] = this.editForm.querySelector('input[name="sk"]').value;
    let allFilled = Object.values(q).every((i) => i !== "");
    if (allFilled) {
      axios.post(con.api+'/kurikulum/silabus/update', q, {headers:con.headers})
      .then(res => {
        this.setState({ silabus:res.data.silabus, silabus_page:1 });
        document.getElementById('table-silabus').parentElement.scrollTo(0,0);
      });
    }
  }
  delete(e){
    let q = {silabus_id: this.state.silabus_self.silabus_id};
    axios.post(con.api+'/kurikulum/silabus/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ silabus:res.data.silabus });
      document.getElementById('table-silabus').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/kurikulum/silabus', {headers:con.headers, params:{page:this.state.silabus_page + 1, q:this.state.silabus_search}})
      .then(res => {
        if (res.data.silabus.length) {
          this.setState({ silabus:this.state.silabus.concat(res.data.silabus), silabus_page:this.state.silabus_page + 1, loading:false });
        }
      });
    }
  }
  searcSilabus(e){
    axios.get(con.api+'/kurikulum/silabus', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ silabus:res.data.silabus, silabus_page:1, silabus_search:res.config.params.q });
    });
  }
  render() {
    const ModalAdd = () => {
      return (
        <form ref={i => this.addForm = i}>
          <div className="row mb-2">
            <Select name="mapel_id" title="Mata Pelajaran" className="col" error="*Mata pelajaran harus di isi" url='kurikulum/mapel/select' placeholder="Pilih Mata Pelajaran" />
            <Select name="kelas_id" title="Kelas" className="col" error="*Kelas harus di isi" url='kelas/select' placeholder="Pilih Kelas" />
            <Select name="semester_id" title="Semester" className="col" error="*Semester harus di isi" url='semester/select' placeholder="Pilih Semester" />
          </div>
          <Input name="sk" title="Standar Kompetensi" divClass="row col mx-0 px-0 mb-2" error="*Standar kompetensi harus di isi" placeholder="Standar Kompetensi" className="text-capitalize" />
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button type="button" className="alert alert-success py-1 px-4 pointer" data-dismiss="modal" onClick={this.add.bind(this)}> Proses </button>
            </div>
          </div>
        </form>
      )
    }
    const ModalEdit = () => {
      return (
        <form ref={i => this.editForm = i}>
          <div className="row mb-2">
            <Select selected={[this.state.silabus_self.mapel.mapel_id, this.state.silabus_self.mapel.nama]} name="mapel_id" title="Mata Pelajaran" className="col" error="*Mata pelajaran harus di isi" url='kurikulum/mapel/select' placeholder="Pilih Mata Pelajaran" />
            <Select selected={[this.state.silabus_self.kelas.kelas_id, this.state.silabus_self.kelas.nama]} name="kelas_id" title="Kelas" className="col" error="*Kelas harus di isi" url='kelas/select' placeholder="Pilih Kelas" />
            <Select selected={[this.state.silabus_self.semester.semester_id, (this.state.silabus_self.semester.nama || '').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())]} name="semester_id" title="Semester" className="col" error="*Semester harus di isi" url='semester/select' placeholder="Pilih Semester" />
          </div>
          <Input name="sk" value={this.state.silabus_self.sk} title="Standar Kompetensi" divClass="row col mx-0 px-0 mb-2" error="*Standar kompetensi harus di isi" className="text-capitalize" placeholder="Standar Kompetensi" />
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button type="button" className="alert alert-success py-1 px-4 pointer" data-dismiss="modal" onClick={this.edit.bind(this)}> Proses </button>
            </div>
          </div>
        </form>
      )
    }
    const ModalDelete = () => {
      return (
        <React.Fragment>
          <div className="row mb-2">
            <div className="col text-center">
              <p className="m-0 lh-15 py-2 alert alert-warning">
                Menghapus silabus menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus silabus <span className="text-danger strong h5">{'"'+(this.state.silabus_self.nama || '').toUpperCase()+'"'}</span> ?
              </p>
            </div>
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="btn btn-sm btn-light radius-5 px-4 mr-2" data-dismiss="modal"> Tutup </button>
              <button className="btn btn-sm btn-danger radius-5 px-4" onClick={this.delete.bind(this)} data-dismiss="modal"> Hapus </button>
            </div>
          </div>
        </React.Fragment>
      )
    }
    if (this.state.loading) {
      return (
        <div className="row">
          <div className="col-12">
            <div className="card bg-transparent no-b">
              <div className="card-body p-0">
                <Skeleton width="100%" height="75px" widthRandomness={0} />
                <Skeleton width="100%" height="25px" count={5} widthRandomness={0} />
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="row">
        <div className="col-12">
          <div className="card no-b shadow-lg radius-10">
            <div className="card-header bg-white b-0 px-3 py-2">
              <div className="row align-items-center">
                <div className="col pr-0">
                  <div className="form-group has-icon m-0">
                    <i className="la la-search" />
                    <input onChange={this.searcSilabus.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Pencarian" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto text-right">
                  <span className="alert alert-info py-1 px-2 pointer f-9" data-toggle="modal" data-target="#tambah-mdl" onClick={() => setTimeout(() => this.addForm.querySelector('input[name="sk"]').focus(), 100) }><i className="la la-plus mr-1"></i><strong>Tambah Silabus</strong></span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover mb-0" id="table-silabus">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs">Kelas</th>
                        <th className="sticky bg-white shadow-xs">Semester</th>
                        <th className="sticky bg-white shadow-xs">Mata Pelajaran</th>
                        <th className="sticky bg-white shadow-xs" colSpan={2}>Standar Kompetensi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.silabus.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center font-bold">{index+1}.</td>
                              <td className="font-bold">{r.kelas.nama}</td>
                              <td className="font-bold text-capitalize">{r.semester.nama}</td>
                              <td className="font-bold">{r.mapel.nama}</td>
                              <td className="font-bold">{r.sk}</td>
                              <td className="text-right">
                                <span className="btn-fab btn-fab-xs btn-warning-light mr-2" data-toggle="modal" data-target="#edit-mdl" onClick={() => this.setState({silabus_self:r}, () => setTimeout(() => this.editForm.querySelector('input[name="sk"]').focus(), 100))}><i className="la la-pen"></i></span>
                                <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-mdl" onClick={() => this.setState({silabus_self:r})}><i className="la la-trash"></i></span>
                              </td>
                            </tr>
                          )
                        )
                      }
                    </tbody>
                  </table>
                </Scrollbars>
              </div>
            </div>
          </div>
          <Modal id='tambah-mdl' size='lg' title='Tambah Silabus' body={<ModalAdd />} />
          <Modal id='edit-mdl' size='lg' title='Edit Silabus' body={<ModalEdit />} />
          <Modal id='delete-mdl' size='md' title='Hapus Silabus' body={<ModalDelete />} />
        </div>
      </div>
    );
  }
}
export default Silabus
