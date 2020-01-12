import React from 'react';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import con from '../api/connection';
import { Scrollbars } from 'react-custom-scrollbars';
import Input from '../misc/input';
import Select from '../misc/select';
import Modal from '../misc/modal';

class RPP extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      rpp:[],
      rpp_page:1,
      rpp_search:'',
      rpp_self:{silabus:{},kelas:{},semester:{},mapel:{}},
      loading:true
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'RPP';
    this._isMounted && axios.get(con.api+'/kurikulum/rpp', {headers:con.headers, params:{page:this.state.rpp_page}})
    .then(res => {
      this.setState({ rpp:res.data.rpp, loading:false });
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  add(e){
    e.preventDefault();
    const q = {};
    q['silabus_id'] = this.addForm.querySelector('select[name="silabus_id"]').value;
    q['kd'] = this.addForm.querySelector('input[name="kd"]').value;
    let allFilled = Object.values(q).every((i) => i !== "");
    if (allFilled) {
      axios.post(con.api+'/kurikulum/rpp/store', q, {headers:con.headers})
      .then(res => {
        this.setState({ rpp:res.data.rpp, rpp_page:1 });
        document.getElementById('table-rpp').parentElement.scrollTo(0,0);
      });
    }
  }
  edit(e){
    e.preventDefault();
    const q = {rpp_id:this.state.rpp_self.rpp_id};
    q['silabus_id'] = this.editForm.querySelector('select[name="silabus_id"]').value;
    q['kd'] = this.editForm.querySelector('input[name="kd"]').value;
    let allFilled = Object.values(q).every((i) => i !== "");
    if (allFilled) {
      axios.post(con.api+'/kurikulum/rpp/update', q, {headers:con.headers})
      .then(res => {
        this.setState({ rpp:res.data.rpp, rpp_page:1 });
        document.getElementById('table-rpp').parentElement.scrollTo(0,0);
      });
    }
  }
  delete(e){
    let q = {rpp_id: this.state.rpp_self.rpp_id};
    axios.post(con.api+'/kurikulum/rpp/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ rpp:res.data.rpp });
      document.getElementById('table-rpp').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/kurikulum/rpp', {headers:con.headers, params:{page:this.state.rpp_page + 1, q:this.state.rpp_search}})
      .then(res => {
        if (res.data.rpp.length) {
          this.setState({ rpp:this.state.rpp.concat(res.data.rpp), rpp_page:this.state.rpp_page + 1, loading:false });
        }
      });
    }
  }
  searcRPP(e){
    axios.get(con.api+'/kurikulum/rpp', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ rpp:res.data.rpp, rpp_page:1, rpp_search:res.config.params.q });
    });
  }
  render() {
    const ModalAdd = () => {
      return (
        <form ref={i => this.addForm = i}>
          <Select name="silabus_id" title="Standar Kompetensi" className="row col mx-0 px-0 mb-2" error="*Standar kompetensi harus di isi" url='kurikulum/silabus/select' placeholder="Pilih Standar Kompetensi" />
          <Input name="kd" title="Kompetensi Dasar" divClass="row col mx-0 px-0 mb-2" error="*Kompetensi dasar harus di isi" className="text-capitalize" placeholder="Tulis kompetensi dasar disini" />
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
          <Select name="silabus_id" title="Standar Kompetensi" className="row col mx-0 px-0 mb-2" error="*Standar kompetensi harus di isi" url='kurikulum/silabus/select' placeholder="Pilih Standar Kompetensi" selected={[this.state.rpp_self.silabus.silabus_id, this.state.rpp_self.silabus.sk + ' (K:'+this.state.rpp_self.kelas.nama+' | S:'+this.state.rpp_self.semester.nama+' | M:'+this.state.rpp_self.mapel.nama+')']} />
          <Input name="kd" value={this.state.rpp_self.kd} title="Kompetensi Dasar" divClass="row col mx-0 px-0 mb-2" error="*Kompetensi dasar harus di isi" className="text-capitalize" placeholder="Tidak boleh kosong" />
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button type="button" className="alert alert-success py-1 px-4 pointer" data-dismiss="modal" onClick={this.edit.bind(this)}> Update </button>
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
                Menghapus rpp menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus rpp <span className="text-danger strong h5">{'"'+(this.state.rpp_self.nama || '').toUpperCase()+'"'}</span> ?
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
                    <input onChange={this.searcRPP.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Pencarian" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto text-right">
                  <span className="alert alert-info py-1 px-2 pointer f-9" data-toggle="modal" data-target="#tambah-mdl" onClick={() => setTimeout(() => this.addForm.querySelector('input[name="kd"]').focus(), 100) }><i className="la la-plus mr-1"></i><strong>Tambah RPP</strong></span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover mb-0" id="table-rpp">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs">Kelas</th>
                        <th className="sticky bg-white shadow-xs">Semester</th>
                        <th className="sticky bg-white shadow-xs">Mata Pelajaran</th>
                        <th className="sticky bg-white shadow-xs">Standar Kompetensi</th>
                        <th className="sticky bg-white shadow-xs" colSpan={2}>Kompetensi Dasar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.rpp.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center font-bold">{index+1}.</td>
                              <td className="bold text-nowrap">{r.kelas.nama}</td>
                              <td className="bold text-nowrap text-capitalize">{r.semester.nama}</td>
                              <td className="bold text-nowrap">{r.mapel.nama}</td>
                              <td className="bold text-nowrap">{r.silabus.sk}</td>
                              <td className="bold text-nowrap">{r.kd}</td>
                              <td className="text-right text-nowrap">
                                <span className="btn-fab btn-fab-xs btn-warning-light mr-2" data-toggle="modal" data-target="#edit-mdl" onClick={() => this.setState({rpp_self:r}, () => setTimeout(() => this.editForm.querySelector('input[name="kd"]').focus(), 100))}><i className="la la-pen"></i></span>
                                <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-mdl" onClick={() => this.setState({rpp_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='tambah-mdl' size='lg' title='Tambah RPP' body={<ModalAdd />} />
          <Modal id='edit-mdl' size='lg' title='Edit RPP' body={<ModalEdit />} />
          <Modal id='delete-mdl' size='md' title='Hapus RPP' body={<ModalDelete />} />
        </div>
      </div>
    );
  }
}
export default RPP
