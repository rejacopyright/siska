import React from 'react';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import { Scrollbars } from 'react-custom-scrollbars';
import con from '../api/connection';
import Modal from '../misc/modal';

class Jabatan extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      jabatan:[],
      jabatan_page:1,
      jabatan_search:'',
      jabatan_self:{},
      loading:true
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Jabatan';
    this._isMounted && axios.get(con.api+'/sdm/jabatan', {headers:con.headers, params:{page:this.state.jabatan_page}})
    .then(res => {
      this.setState({ jabatan:res.data.jabatan, loading:false });
    });
    }
  componentWillUnmount() {
    this._isMounted = false;
  }
  add(){
    const q = {
      nama:this.nama.value
    }
    if (this.nama.value) {
      axios.post(con.api+'/sdm/jabatan/store', q, {headers:con.headers})
      .then(res => {
        this.setState({ jabatan:res.data.jabatan, jabatan_page:1 });
        document.getElementById('table-jabatan').parentElement.scrollTo(0,0);
    });
    }
  }
  edit(){
    let q = {jabatan_id: this.state.jabatan_self.jabatan_id, nama:this.nama_edit.value};
    if (this.nama_edit.value) {
      axios.post(con.api+'/sdm/jabatan/update', q, {headers:con.headers})
      .then(res => {
        this.setState({ jabatan:res.data.jabatan, jabatan_page:1 });
        document.getElementById('table-jabatan').parentElement.scrollTo(0,0);
    });
    }
  }
  delete(e){
    let q = {jabatan_id: this.state.jabatan_self.jabatan_id};
    axios.post(con.api+'/sdm/jabatan/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ jabatan:res.data.jabatan });
      document.getElementById('table-jabatan').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/sdm/jabatan', {headers:con.headers, params:{page:this.state.jabatan_page + 1, q:this.state.jabatan_search}})
      .then(res => {
        if (res.data.jabatan.length) {
          this.setState({ jabatan:this.state.jabatan.concat(res.data.jabatan), jabatan_page:this.state.jabatan_page + 1, loading:false });
        }
      });
    }
  }
  searcJabatan(e){
    axios.get(con.api+'/sdm/jabatan', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ jabatan:res.data.jabatan, jabatan_page:1, jabatan_search:res.config.params.q });
    });
  }
  render() {
    const ModalAdd = () => {
      return (
        <React.Fragment>
          <div className="row">
            <div className="col">
              <small>Nama Jabatan</small>
              <input type="text" ref={i => this.nama = i} className="form-control form-control-sm radius-5 bg-light" placeholder="Tulis disini" required />
            </div>
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="btn btn-sm btn-success radius-5 px-4" onClick={this.add.bind(this)} data-dismiss="modal"> Proses </button>
            </div>
          </div>
        </React.Fragment>
      )
    }
    const ModalEdit = () => {
      return (
        <React.Fragment>
          <div className="row">
            <div className="col">
              <small>Nama Jabatan</small>
              <input type="text" defaultValue={this.state.jabatan_self.nama} ref={i => this.nama_edit = i} className="form-control form-control-sm radius-5 bg-light" placeholder="Tulis disini" required />
            </div>
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="btn btn-sm btn-success radius-5 px-4" onClick={this.edit.bind(this)} data-dismiss="modal"> Proses </button>
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
                Menghapus jabatan menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus jabatan <span className="text-danger strong h5">{(this.state.jabatan_self.nama || '').toUpperCase()}</span> ?
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
          <div className="col-md-6 offset-md-3">
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
        <div className="col-md-6 offset-md-3">
          <div className="card no-b shadow-lg radius-10">
            <div className="card-header bg-white b-0 px-2 py-2">
              <div className="row align-items-center">
                <div className="col pr-0">
                  <div className="form-group has-icon m-0">
                    <i className="la la-search" />
                    <input onChange={this.searcJabatan.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Pencarian" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto pl-2 text-right">
                  <span className="alert alert-info py-1 px-2 pointer f-9" data-toggle="modal" data-target="#tambah-mdl" onClick={() => setTimeout(() => this.nama.focus(), 100)}><i className="la la-plus mr-1"></i><strong>Tambah Jabatan</strong></span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover mb-0" id="table-jabatan">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs" colSpan={2}>Jabatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.jabatan.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center font-bold">{index+1}.</td>
                              <td className="font-bold">{r.nama}</td>
                              <td className="text-right">
                                <span className="btn-fab btn-fab-xs btn-warning-light mr-2" data-toggle="modal" data-target="#edit-jabatan-mdl" onClick={() => this.setState({jabatan_self:r}, () => setTimeout(() => this.nama_edit.focus(), 100))}><i className="la la-pen"></i></span>
                                <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-jabatan-mdl" onClick={() => this.setState({jabatan_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='tambah-mdl' size='md' title='Tambah Jabatan' body={<ModalAdd />} />
          <Modal id='edit-jabatan-mdl' size='md' title='Edit Jabatan' body={<ModalEdit />} />
          <Modal id='delete-jabatan-mdl' size='md' title='Hapus Jabatan' body={<ModalDelete />} />
        </div>
      </div>
    );
  }
}
export default Jabatan
