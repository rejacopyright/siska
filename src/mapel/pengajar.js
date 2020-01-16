import React from 'react';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import con from '../api/connection';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from '../misc/select';
import Modal from '../misc/modal';
import Notif from '../misc/notif';

class Pengajar extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      pengajar:{},
      pengajar_page:1,
      pengajar_search:'',
      pengajar_self:{admin:{},kelas:{},mapel:{}},
      loading:true,
      notifBg:'success',
      notifMsg:''
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Pengajar';
    this._isMounted && axios.get(con.api+'/pengajar', {headers:con.headers, params:{page:this.state.pengajar_page}})
    .then(res => {
      this.setState({ pengajar:res.data.pengajar, loading:false });
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  add(e){
    e.preventDefault();
    const q = {};
    q['admin_id'] = this.addForm.querySelector('select[name="admin_id"]').value;
    q['kelas_id'] = this.addForm.querySelector('select[name="kelas_id"]').value;
    q['mapel_id'] = this.addForm.querySelector('select[name="mapel_id"]').value;
    if (q.admin_id && q.kelas_id && q.mapel_id) {
      axios.post(con.api+'/pengajar/store', q, {headers:con.headers})
      .then(res => {
        this.setState({ pengajar:res.data.pengajar, pengajar_page:1, notifBg:'success', notifMsg:'Data Pengajar berhasil diupdate' }, () => {
          document.querySelector('.notif-show').click();
          document.getElementById('table-pengajar').parentElement.scrollTo(0,0);
        });
      });
    }else {
      this.setState({ notifBg:'danger', notifMsg:'Mohon periksa kembali kelengkapan data yang harus di isi' }, () => document.querySelector('.notif-show').click());
    }
  }
  edit(e){
    e.preventDefault();
    const q = {pengajar_id:this.state.pengajar_self.pengajar_id};
    q['admin_id'] = this.editForm.querySelector('select[name="admin_id"]').value;
    q['kelas_id'] = this.editForm.querySelector('select[name="kelas_id"]').value;
    q['mapel_id'] = this.editForm.querySelector('select[name="mapel_id"]').value;
    if (q.admin_id && q.kelas_id && q.mapel_id) {
      axios.post(con.api+'/pengajar/update', q, {headers:con.headers})
      .then(res => {
        this.setState({ pengajar:res.data.pengajar, pengajar_page:1, notifBg:'success', notifMsg:'Perubahan berhasil disimpan' }, () => {
          document.querySelector('.notif-show').click();
          document.getElementById('table-pengajar').parentElement.scrollTo(0,0);
        });
      });
    }else {
      this.setState({ notifBg:'danger', notifMsg:'Mohon periksa kembali kelengkapan data yang harus di isi' }, () => document.querySelector('.notif-show').click());
    }
  }
  delete(e){
    let q = {pengajar_id: this.state.pengajar_self.pengajar_id};
    axios.post(con.api+'/pengajar/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ pengajar:res.data.pengajar });
      document.getElementById('table-pengajar').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/pengajar', {headers:con.headers, params:{page:this.state.pengajar_page + 1, q:this.state.pengajar_search}})
      .then(res => {
        if (res.data.pengajar.length) {
          this.setState({ pengajar:this.state.pengajar.concat(res.data.pengajar), pengajar_page:this.state.pengajar_page + 1, loading:false });
        }
      });
    }
  }
  searcPengajar(e){
    axios.get(con.api+'/pengajar', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ pengajar:res.data.pengajar, pengajar_page:1, pengajar_search:res.config.params.q });
    });
  }
  render() {
    const ModalAdd = () => {
      return (
        <form ref={i => this.addForm = i}>
          <div className="row">
            <Select name="admin_id" title="Pengajar" className="col-md mb-2" error="*Pengajar harus di isi" url='sdm/user/select' placeholder="Pilih Pengajar" />
            <Select name="kelas_id" title="Kelas" className="col-md mb-2" error="*Kelas harus di isi" url='kelas/select' placeholder="Pilih Kelas" />
            <Select name="mapel_id" title="Mata Pelajaran" className="col-md mb-2" error="*Mata Pelajaran harus di isi" url='kurikulum/mapel/select' placeholder="Pilih Mata Pelajaran" />
          </div>
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
          <div className="row">
            <Select name="admin_id" title="Pengajar" className="col-md mb-2" error="*Pengajar harus di isi" url='sdm/user/select' placeholder="Pilih Pengajar" selected={[this.state.pengajar_self.admin.admin_id, this.state.pengajar_self.admin.nama]} />
            <Select name="kelas_id" title="Kelas" className="col-md mb-2" error="*Kelas harus di isi" url='kelas/select' placeholder="Pilih Kelas" selected={[this.state.pengajar_self.kelas.kelas_id, this.state.pengajar_self.kelas.nama]} />
            <Select name="mapel_id" title="Mata Pelajaran" className="col-md mb-2" error="*Mata Pelajaran harus di isi" url='kurikulum/mapel/select' placeholder="Pilih Mata Pelajaran" selected={[this.state.pengajar_self.mapel.mapel_id, this.state.pengajar_self.mapel.nama]} />
          </div>
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
                Menghapus pengajar menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus pengajar <span className="text-danger strong h5">{'"'+(this.state.pengajar_self.nama || '').toUpperCase()+'"'}</span> ?
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
          <Notif close duration="5000" bg={this.state.notifBg} v="bottom" h="center" message={this.state.notifMsg} />
          <div className="card no-b shadow-lg radius-10">
            <div className="card-header bg-white b-0 px-3 py-2">
              <div className="row align-items-center">
                <div className="col pr-0">
                  <div className="form-group has-icon m-0">
                    <i className="la la-search" />
                    <input onChange={this.searcPengajar.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Pencarian" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto text-right">
                  <span className="alert alert-info py-1 px-2 pointer f-9" data-toggle="modal" data-target="#tambah-mdl"><i className="la la-plus mr-1"></i><strong>Tambah Pengajar</strong></span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover mb-0" id="table-pengajar">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs">Pengajar</th>
                        <th className="sticky bg-white shadow-xs">Kelas</th>
                        <th className="sticky bg-white shadow-xs" colSpan={2}>Mata Pelajaran</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.pengajar.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center bold">{index+1}.</td>
                              <td className="bold text-capitalize">{r.admin.nama}</td>
                              <td className="bold">{r.kelas.nama}</td>
                              <td className="bold">{r.mapel.nama}</td>
                              <td className="text-right">
                                <span className="btn-fab btn-fab-xs btn-warning-light mr-2" data-toggle="modal" data-target="#edit-mdl" onClick={() => this.setState({pengajar_self:r})}><i className="la la-pen"></i></span>
                                <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-mdl" onClick={() => this.setState({pengajar_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='tambah-mdl' size='lg' title='Tambah Pengajar' body={<ModalAdd />} />
          <Modal id='edit-mdl' size='lg' title='Edit Pengajar' body={<ModalEdit />} />
          <Modal id='delete-mdl' size='md' title='Hapus Pengajar' body={<ModalDelete />} />
        </div>
      </div>
    );
  }
}
export default Pengajar
