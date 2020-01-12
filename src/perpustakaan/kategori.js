import React from 'react';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import con from '../api/connection';
import { Scrollbars } from 'react-custom-scrollbars';
import Input from '../misc/input';
import Text from '../misc/text';
import Modal from '../misc/modal';
import Pop from '../misc/popover';

class Kategori extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      kategori:[],
      kategori_page:1,
      kategori_search:'',
      kategori_self:{},
      loading:true
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Kategori';
    this._isMounted && axios.get(con.api+'/perpustakaan/kategori', {headers:con.headers, params:{page:this.state.kategori_page}})
    .then(res => {
      this.setState({ kategori:res.data.kategori, loading:false });
    });
    }
  componentWillUnmount() {
    this._isMounted = false;
  }
  add(e){
    e.preventDefault();
    const q = {};
    q['nama'] = this.addForm.querySelector('input[name="nama"]').value;
    q['keterangan'] = this.addForm.querySelector('textarea[name="keterangan"]').value;
    if (q.nama) {
      axios.post(con.api+'/perpustakaan/kategori/store', q, {headers:con.headers})
      .then(res => {
        this.setState({ kategori:res.data.kategori, kategori_page:1 });
        document.getElementById('table-kategori').parentElement.scrollTo(0,0);
      });
    }
  }
  edit(e){
    e.preventDefault();
    const q = {kategori_id:this.state.kategori_self.kategori_id};
    q['nama'] = this.editForm.querySelector('input[name="nama"]').value;
    q['keterangan'] = this.editForm.querySelector('textarea[name="keterangan"]').value;
    if (q.nama) {
      axios.post(con.api+'/perpustakaan/kategori/update', q, {headers:con.headers})
      .then(res => {
        this.setState({ kategori:res.data.kategori, kategori_page:1 });
        document.getElementById('table-kategori').parentElement.scrollTo(0,0);
      });
    }
  }
  delete(e){
    let q = {kategori_id: this.state.kategori_self.kategori_id};
    axios.post(con.api+'/perpustakaan/kategori/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ kategori:res.data.kategori });
      document.getElementById('table-kategori').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/perpustakaan/kategori', {headers:con.headers, params:{page:this.state.kategori_page + 1, q:this.state.kategori_search}})
      .then(res => {
        if (res.data.kategori.length) {
          this.setState({ kategori:this.state.kategori.concat(res.data.kategori), kategori_page:this.state.kategori_page + 1, loading:false });
        }
      });
    }
  }
  searcKategori(e){
    axios.get(con.api+'/perpustakaan/kategori', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ kategori:res.data.kategori, kategori_page:1, kategori_search:res.config.params.q });
    });
  }
  render() {
    const ModalAdd = () => {
      return (
        <div ref={i => this.addForm = i}>
          <div className="row">
            <Input name="nama" divClass="col-12 mb-2" title="Nama Kategori" capital error="*Nama Kategori harus di isi" placeholder="Nama Kategori" />
            <Text name="keterangan" divClass="col-12 mb-2" title="Keterangan" placeholder="Keterangan Opsional (Tulis jika membutuhkan keterangan)" rows="5" />
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="alert alert-light py-1 px-4 pointer mr-2" data-dismiss="modal"> Tutup </button>
              <button className="alert alert-success py-1 px-4 pointer" onClick={this.add.bind(this)} data-dismiss="modal"> Proses </button>
            </div>
          </div>
        </div>
      )
    }
    const ModalEdit = () => {
      return (
        <div ref={i => this.editForm = i}>
          <div className="row">
            <Input name="nama" value={this.state.kategori_self.nama} capital divClass="col-12 mb-2" title="Nama Kategori" error="*Nama Kategori harus di isi" placeholder="Nama Kategori" />
            <Text name="keterangan" value={this.state.kategori_self.keterangan} divClass="col-12 mb-2" title="Keterangan" placeholder="Keterangan Opsional (Tulis jika membutuhkan keterangan)" rows="5" />
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="alert alert-light py-1 px-4 pointer mr-2" data-dismiss="modal"> Tutup </button>
              <button className="alert alert-success py-1 px-4 pointer" onClick={this.edit.bind(this)} data-dismiss="modal"> Update </button>
            </div>
          </div>
        </div>
      )
    }
    const ModalDelete = () => {
      return (
        <React.Fragment>
          <div className="row mb-2">
            <div className="col text-center">
              <p className="m-0 lh-15 alert alert-warning">
                Menghapus kategori menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus kategori <span className="text-danger strong h5">{(this.state.kategori_self.nama || '').toUpperCase()}</span> ?
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
            <div className="card-header bg-white b-0 px-2 py-2">
              <div className="row align-items-center">
                <div className="col pr-0">
                  <div className="form-group has-icon m-0">
                    <i className="la la-search" />
                    <input onChange={this.searcKategori.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Pencarian" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto pl-2 text-right">
                  <span className="alert alert-info py-1 px-2 pointer f-9" data-toggle="modal" data-target="#tambah-mdl" onClick={() => setTimeout(() => this.addForm.querySelector('input[name="nama"]').focus(), 100)}><i className="la la-plus mr-1"></i><strong>Tambah Kategori</strong></span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover mb-0" id="table-kategori">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs">Kategori</th>
                        <th className="sticky bg-white shadow-xs" colSpan={2}>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.kategori.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center bold">{index+1}.</td>
                              <td className="bolder">{r.nama}</td>
                              <td className="bold"><Pop title="Keterangan" content={r.keterangan} length="5" /></td>
                              <td className="text-right text-nowrap">
                                <span className="btn-fab btn-fab-xs btn-warning-light mr-2" data-toggle="modal" data-target="#edit-kategori-mdl" onClick={() => this.setState({kategori_self:r}, () => setTimeout(() => this.editForm.querySelector('input[name="nama"]').focus(), 100))}><i className="la la-pen"></i></span>
                                <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-kategori-mdl" onClick={() => this.setState({kategori_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='tambah-mdl' size='md' title='Tambah Kategori' body={<ModalAdd />} />
          <Modal id='edit-kategori-mdl' size='md' title='Edit Kategori' body={<ModalEdit />} />
          <Modal id='delete-kategori-mdl' size='md' title='Hapus Kategori' body={<ModalDelete />} />
        </div>
      </div>
    );
  }
}
export default Kategori
