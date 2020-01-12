import React from 'react';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import con from '../api/connection';
import { Scrollbars } from 'react-custom-scrollbars';
import Input from '../misc/input';
import Select from '../misc/select';
import Modal from '../misc/modal';

class Kelas extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      kelas:[],
      kelas_page:1,
      kelas_search:'',
      kelas_self:{wali_kelas:{}},
      loading:true
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Kelas';
    this._isMounted && axios.get(con.api+'/kelas', {headers:con.headers, params:{page:this.state.kelas_page}})
    .then(res => {
      this.setState({ kelas:res.data.kelas, loading:false });
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  add(e){
    e.preventDefault();
    const q = {};
    q['nama'] = this.addForm.querySelector('input[name="nama"]').value;
    q['wali'] = this.addForm.querySelector('select[name="wali"]').value;
    if (q.nama && q.wali) {
      axios.post(con.api+'/kelas/store', q, {headers:con.headers})
      .then(res => {
        this.setState({ kelas:res.data.kelas, kelas_page:1 });
        document.getElementById('table-kelas').parentElement.scrollTo(0,0);
      });
    }
  }
  edit(e){
    e.preventDefault();
    const q = {kelas_id:this.state.kelas_self.kelas_id};
    q['nama'] = this.editForm.querySelector('input[name="nama"]').value;
    q['wali'] = this.editForm.querySelector('select[name="wali"]').value;
    if (q.nama && q.wali) {
      axios.post(con.api+'/kelas/update', q, {headers:con.headers})
      .then(res => {
        this.setState({ kelas:res.data.kelas, kelas_page:1 });
        document.getElementById('table-kelas').parentElement.scrollTo(0,0);
      });
    }
  }
  delete(e){
    let q = {kelas_id: this.state.kelas_self.kelas_id};
    axios.post(con.api+'/kelas/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ kelas:res.data.kelas });
      document.getElementById('table-kelas').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/kelas', {headers:con.headers, params:{page:this.state.kelas_page + 1, q:this.state.kelas_search}})
      .then(res => {
        if (res.data.kelas.length) {
          this.setState({ kelas:this.state.kelas.concat(res.data.kelas), kelas_page:this.state.kelas_page + 1, loading:false });
        }
      });
    }
  }
  searcKelas(e){
    axios.get(con.api+'/kelas', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ kelas:res.data.kelas, kelas_page:1, kelas_search:res.config.params.q });
    });
  }
  render() {
    const ModalAdd = () => {
      return (
        <form ref={i => this.addForm = i}>
          <Input name="nama" title="Nama Kelas" divClass="row col mx-0 px-0 mb-2" error="*Nama kelas harus di isi" className="text-capitalize" placeholder="Contoh : 1 A IPA" />
          <Select name="wali" title="Wali Kelas" className="row col mx-0 px-0 mb-2" error="*Wali kelas harus di isi" url='sdm/user/select' placeholder="Pilih wali kelas" />
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
          <Input name="nama" value={this.state.kelas_self.nama} title="Nama Kelas" divClass="row col mx-0 px-0 mb-2" error="*Nama kelas harus di isi" className="text-capitalize" placeholder="Tidak boleh kosong" />
          <Select name="wali" title="Wali Kelas" className="row col mx-0 px-0 mb-2" error="*Wali kelas harus di isi" url='sdm/user/select' placeholder="Pilih wali kelas" selected={[this.state.kelas_self.wali_kelas.admin_id, this.state.kelas_self.wali_kelas.nama]} />
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
                Menghapus kelas menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus kelas <span className="text-danger strong h5">{'"'+(this.state.kelas_self.nama || '').toUpperCase()+'"'}</span> ?
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
          <div className="col-md-8 offset-md-2">
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
        <div className="col-md-8 offset-md-2">
          <div className="card no-b shadow-lg radius-10">
            <div className="card-header bg-white b-0 px-3 py-2">
              <div className="row align-items-center">
                <div className="col pr-0">
                  <div className="form-group has-icon m-0">
                    <i className="la la-search" />
                    <input onChange={this.searcKelas.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Pencarian" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto text-right">
                  <span className="alert alert-info py-1 px-2 pointer f-9" data-toggle="modal" data-target="#tambah-mdl" onClick={() => setTimeout(() => this.addForm.querySelector('input[name="nama"]').focus(), 100) }><i className="la la-plus mr-1"></i><strong>Tambah Kelas</strong></span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover mb-0" id="table-kelas">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs">Kelas</th>
                        <th className="sticky bg-white shadow-xs" colSpan={2}>Wali Kelas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.kelas.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center font-bold">{index+1}.</td>
                              <td className="font-bold">{r.nama}</td>
                              <td className="font-bold">{r.wali_kelas.nama}</td>
                              <td className="text-right">
                                <span className="btn-fab btn-fab-xs btn-warning-light mr-2" data-toggle="modal" data-target="#edit-mdl" onClick={() => this.setState({kelas_self:r}, () => setTimeout(() => this.editForm.querySelector('input[name="nama"]').focus(), 100))}><i className="la la-pen"></i></span>
                                <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-mdl" onClick={() => this.setState({kelas_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='tambah-mdl' size='sm' title='Tambah Kelas' body={<ModalAdd />} />
          <Modal id='edit-mdl' size='sm' title='Edit Kelas' body={<ModalEdit />} />
          <Modal id='delete-mdl' size='md' title='Hapus Kelas' body={<ModalDelete />} />
        </div>
      </div>
    );
  }
}
export default Kelas
