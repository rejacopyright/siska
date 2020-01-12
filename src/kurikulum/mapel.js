import React from 'react';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import { Scrollbars } from 'react-custom-scrollbars';
import con from '../api/connection';
import Select from '../misc/select';
import Modal from '../misc/modal';

class Kategori extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      kategori:[],
      kategori_self:{},
      loading:true
    }
  }
  componentDidMount() {
    this._isMounted = true;
    this._isMounted && axios.get(con.api+'/kurikulum/kategori',{headers:con.headers}).then(res => this.setState({ kategori:res.data, loading:false}));
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  ctTrigger = () => {
    this.props.ctTrigger();
  }
  addCategory(){
    if (this.nama.value) {
      axios.post(con.api+'/kurikulum/kategori/store', { nama: this.nama.value}, {headers:con.headers})
      .then(res => this.setState({ kategori:res.data.kategori }));
    }
  }
  editCategory(){
    let q = {kategori_id: this.state.kategori_self.kategori_id, nama:this.nama_edit.value};
    if (this.nama_edit.value) {
      axios.post(con.api+'/kurikulum/kategori/update', q, {headers:con.headers})
      .then(res => this.setState({ kategori:res.data.kategori }, this.ctTrigger));
    }
  }
  deleteCategory(){
    let q = {kategori_id: this.state.kategori_self.kategori_id};
    if (this.nama_edit.value) {
      axios.post(con.api+'/kurikulum/kategori/delete', q, {headers:con.headers})
      .then(res => this.setState({ kategori:res.data.kategori }, this.ctTrigger));
    }
  }
  render() {
    const ModalAddCategory = () => {
      return (
        <React.Fragment>
          <div className="row mb-2">
            <div className="col">
              <small className="text-dark">Kategori</small>
              <input type="text" ref={i => this.nama = i} className="form-control form-control-sm radius-5 bg-light" placeholder="Tulis disini" />
            </div>
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="alert alert-success py-2 px-5 pointer" onClick={this.addCategory.bind(this)} data-dismiss="modal"> Proses </button>
            </div>
          </div>
        </React.Fragment>
      )
    }
    const ModalEditCategory = () => {
      return (
        <React.Fragment>
          <div className="row mb-2">
            <div className="col">
              <input type="text" defaultValue={this.state.kategori_self.nama} ref={i => this.nama_edit = i} className="form-control form-control-sm radius-5 bg-light" placeholder="Tulis disini" />
            </div>
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="alert alert-success py-2 px-5 pointer" onClick={this.editCategory.bind(this)} data-dismiss="modal"> Update </button>
            </div>
          </div>
        </React.Fragment>
      )
    }
    const ModalDeleteCategory = () => {
      return (
        <React.Fragment>
          <div className="row mb-2">
            <div className="col text-center">
              <p className="m-0 lh-15 alert alert-warning">
                Menghapus kategori menyebabkan seluruh mata pelajaran dan modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus kategori <span className="text-danger strong h5">{(this.state.kategori_self.nama || '').toUpperCase()}</span> ?
              </p>
            </div>
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="btn btn-sm btn-light radius-5 px-4 mr-2" data-dismiss="modal"> Tutup </button>
              <button className="btn btn-sm btn-danger radius-5 px-4" onClick={this.deleteCategory.bind(this)} data-dismiss="modal"> Hapus </button>
            </div>
          </div>
        </React.Fragment>
      )
    }
    if (this.state.loading) {
      return (
        <div className="card bg-transparent no-b">
          <div className="card-body p-0">
            <Skeleton width="100%" height="50px" widthRandomness={0} />
            <Skeleton width="100%" count={5} widthRandomness={0} />
          </div>
        </div>
      )
    }
    return (
      <React.Fragment>
        <div className="card no-b radius-10 shadow-md">
          <div className="card-header bg-white no-b p-2 d-flex align-items-center">
            <div className="col-auto f-8 bolder"> Kategori </div>
            <div className="col text-right px-0">
              <span className="alert alert-warning py-1 f-8 bolder pointer" data-toggle="modal" data-target="#tambah-ct-mdl" onClick={() => setTimeout(() => this.nama.focus(), 100)}><i className="la la-plus mr-1"></i><strong>Tambah Kategori</strong></span>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <tbody>
                  {
                    this.state.kategori.map(
                      (r, index) => (
                        <tr key={index}>
                          <td className="text-center font-bold">{index+1}.</td>
                          <td className="font-bold">{r.nama}</td>
                          <td className="text-right">
                            <span className="btn-fab btn-fab-xs btn-warning-light mr-2" data-toggle="modal" data-target="#edit-ct-mdl" onClick={() => this.setState({kategori_self:r}, () => setTimeout(() => this.nama_edit.focus(), 100))}><i className="la la-pen"></i></span>
                            <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-ct-mdl" onClick={() => this.setState({kategori_self:r})}><i className="la la-trash"></i></span>
                          </td>
                        </tr>
                      )
                    )
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal id='tambah-ct-mdl' size='md' title='Tambah Kategori' body={<ModalAddCategory />} />
        <Modal id='edit-ct-mdl' size='md' title='Edit Kategori' body={<ModalEditCategory />} />
        <Modal id='delete-ct-mdl' size='md' title='Hapus Kategori' body={<ModalDeleteCategory />} />
      </React.Fragment>
    );
  }
}
class Mapel extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      mapel:[],
      mapel_page:1,
      mapel_search:'',
      mapel_self:{kategori:{}},
      loading:true
    }
  }
  onKategoriChange = () => {
    axios.get(con.api+'/kurikulum/mapel', {headers:con.headers, params:{page:this.state.mapel_page}})
    .then(res => {
      this.setState({ mapel:res.data.mapel, loading:false });
    });
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Mata Pelajaran';
    this._isMounted && axios.get(con.api+'/kurikulum/mapel', {headers:con.headers, params:{page:this.state.mapel_page}})
    .then(res => {
      this.setState({ mapel:res.data.mapel, loading:false });
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  add(){
    const q = {
      kategori_id:this.sel.state.value,
      nama:this.nama.value
    }
    if (this.nama.value && this.sel.state.value) {
      axios.post(con.api+'/kurikulum/mapel/store', q, {headers:con.headers})
      .then(res => {
        this.setState({ mapel:res.data.mapel, mapel_page:1 });
        document.getElementById('table-mapel').parentElement.scrollTo(0,0);
    });
    }
  }
  edit(){
    let q = {mapel_id: this.state.mapel_self.mapel_id, nama:this.nama_edit.value, kategori_id:this.sel_edit.state.value};
    if (this.nama_edit.value) {
      axios.post(con.api+'/kurikulum/mapel/update', q, {headers:con.headers})
      .then(res => {
        this.setState({ mapel:res.data.mapel, mapel_page:1 });
        document.getElementById('table-mapel').parentElement.scrollTo(0,0);
    });
    }
  }
  delete(e){
    let q = {mapel_id: this.state.mapel_self.mapel_id};
    axios.post(con.api+'/kurikulum/mapel/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ mapel:res.data.mapel });
      document.getElementById('table-mapel').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/kurikulum/mapel', {headers:con.headers, params:{page:this.state.mapel_page + 1, q:this.state.mapel_search}})
      .then(res => {
        if (res.data.mapel.length) {
          this.setState({ mapel:this.state.mapel.concat(res.data.mapel), mapel_page:this.state.mapel_page + 1, loading:false });
        }
      });
    }
  }
  searcMapel(e){
    axios.get(con.api+'/kurikulum/mapel', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ mapel:res.data.mapel, mapel_page:1, mapel_search:res.config.params.q });
    });
  }
  render() {
    const ModalAdd = () => {
      return (
        <React.Fragment>
          <div className="row mb-2">
            <div className="col">
              <small>Nama Mata Pelajaran</small>
              <input type="text" ref={i => this.nama = i} className="form-control form-control-sm radius-5 bg-light" placeholder="Tulis disini" required />
            </div>
          </div>
          <div className="row">
            <Select name='oke' className="col" title="Kategori" ref={i => this.sel = i} url='kurikulum/kategori/select' placeholder="Pilih Kategori" />
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="alert alert-success py-2 px-5 pointer" onClick={this.add.bind(this)} data-dismiss="modal"> Proses </button>
            </div>
          </div>
        </React.Fragment>
      )
    }
    const ModalEdit = () => {
      return (
        <React.Fragment>
          <div className="row mb-2">
            <div className="col">
              <small>Nama Mata Pelajaran</small>
              <input type="text" defaultValue={this.state.mapel_self.nama} ref={i => this.nama_edit = i} className="form-control form-control-sm radius-5 bg-light" placeholder="Tulis disini" required />
            </div>
          </div>
          <div className="row">
            <Select name='oke' title="Kategori" className="col" ref={i => this.sel_edit = i} url='kurikulum/kategori/select' placeholder="Pilih Kategori" selected={[this.state.mapel_self.kategori.kategori_id, this.state.mapel_self.kategori.nama]} />
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="alert alert-success py-2 px-5 pointer" onClick={this.edit.bind(this)} data-dismiss="modal"> Update </button>
            </div>
          </div>
        </React.Fragment>
      )
    }
    const ModalDelete = () => {
      return (
        <React.Fragment>
          <div className="row mb-2">
            <div className="col text-center">
              <p className="m-0 lh-15 alert alert-warning">
                Menghapus mapel menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus mapel <span className="text-danger strong h5">{(this.state.mapel_self.nama || '').toUpperCase()}</span> ?
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
          <div className="col-md-8">
            <div className="card bg-transparent no-b">
              <div className="card-body p-0">
                <Skeleton width="100%" height="75px" widthRandomness={0} />
                <Skeleton width="100%" height="25px" count={5} widthRandomness={0} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-transparent no-b">
              <div className="card-body p-0">
                <Skeleton width="100%" height="50px" widthRandomness={0} />
                <Skeleton width="100%" count={5} widthRandomness={0} />
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="row">
        <div className="col-md-8">
          <div className="card no-b shadow-md radius-10">
            <div className="card-header bg-white b-0 px-3 py-2">
              <div className="row align-items-center">
                <div className="col pr-0">
                  <div className="form-group has-icon m-0">
                    <i className="la la-search" />
                    <input onChange={this.searcMapel.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Pencarian" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto">
                  <div className="alert alert-info py-1 radius-5 f-9 hpx-30 pointer" data-toggle="modal" data-target="#tambah-mp-mdl" onClick={() => setTimeout(() => this.nama.focus(), 100)}><i className="la la-plus mr-1"></i><strong>Tambah Mata Pelajaran</strong></div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover mb-0" id="table-mapel">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs">Mata Pelajaran</th>
                        <th className="sticky bg-white shadow-xs" colSpan={2}>Kategori</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.mapel.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center font-bold">{index+1}.</td>
                              <td className="font-bold">{r.nama}</td>
                              <td className="font-bold">{r.kategori.nama}</td>
                              <td className="text-right">
                                <span className="btn-fab btn-fab-xs btn-warning-light mr-2" data-toggle="modal" data-target="#edit-mp-mdl" onClick={() => this.setState({mapel_self:r}, () => setTimeout(() => this.nama_edit.focus(), 100))}><i className="la la-pen"></i></span>
                                <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-mp-mdl" onClick={() => this.setState({mapel_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='tambah-mp-mdl' size='md' title='Tambah Mata Pelajaran' body={<ModalAdd />} />
          <Modal id='edit-mp-mdl' size='md' title='Edit Mata Pelajaran' body={<ModalEdit />} />
          <Modal id='delete-mp-mdl' size='md' title='Hapus Mata Pelajaran' body={<ModalDelete />} />
        </div>
        <div className="col-md-4">
          <Kategori ctTrigger={this.onKategoriChange} />
        </div>
      </div>
    );
  }
}
export default Mapel
