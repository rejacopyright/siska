import React from 'react';
import {Link} from 'react-router-dom';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import con from '../api/connection';
import { Scrollbars } from 'react-custom-scrollbars';
import Modal from '../misc/modal';
import Pop from '../misc/popover';
import moment from 'moment';
import 'moment/locale/id';
import Random from 'randomstring';

class Siswa extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      siswa:{},
      siswa_page:1,
      siswa_search:'',
      siswa_self:{jabatan:{}},
      loading:true,
      avatar:'user.png',
      base64:''
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Siswa';
    this._isMounted && axios.get(con.api+'/siswa/alumni', {headers:con.headers, params:{page:this.state.siswa_page}})
    .then(res => {
      this.setState({ siswa:res.data.siswa, loading:false });
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  delete(e){
    let q = {siswa_id: this.state.siswa_self.siswa_id};
    axios.post(con.api+'/siswa/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ siswa:res.data.siswa });
      document.getElementById('table-siswa').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/siswa/alumni', {headers:con.headers, params:{page:this.state.siswa_page + 1, q:this.state.siswa_search}})
      .then(res => {
        if (res.data.siswa.length) {
          this.setState({ siswa:this.state.siswa.concat(res.data.siswa), siswa_page:this.state.siswa_page + 1, loading:false });
        }
      });
    }
  }
  searcSiswa(e){
    axios.get(con.api+'/siswa/alumni', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ siswa:res.data.siswa, siswa_page:1, siswa_search:res.config.params.q });
    });
  }
  render() {
    const ModalDelete = () => {
      return (
        <React.Fragment>
          <div className="row mb-2">
            <div className="col text-center">
              <p className="m-0 lh-15 alert alert-warning">
                Menghapus siswa menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus siswa <span className="text-danger strong h5">{this.state.siswa_self.nama || ''}</span> ?
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
    const ModalAddImg = () => {
      return (
        <React.Fragment>
          <img src={this.state.avatar+'?'+Random.generate()} ref={i => this.img = i} alt="img" className={this.state.siswa_self.avatar ? 'w-100' : 'p-5 '} />
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
          <div className="card no-b shadow-lg radius-10 px-2">
            <div className="card-header bg-white b-0 px-3 py-2">
              <div className="row align-items-center">
                <div className="col px-0">
                  <div className="form-group has-icon m-0">
                    <i className="la la-search" />
                    <input onChange={this.searcSiswa.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Pencarian" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto pr-0 text-right">
                  <Link to="/siswa/add" className="alert alert-info py-1 px-2 pointer f-9 bolder"><i className="la la-plus la-lg mr-1"></i>Tambah Daftar Siswa Lulus</Link>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover mb-0" id="table-siswa">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs text-center">#</th>
                        <th className="sticky bg-white shadow-xs">Nama</th>
                        <th className="sticky bg-white shadow-xs">NIS</th>
                        <th className="sticky bg-white shadow-xs">Gender</th>
                        <th className="sticky bg-white shadow-xs">Usia</th>
                        <th className="sticky bg-white shadow-xs">Alamat</th>
                        <th className="sticky bg-white shadow-xs">Wali</th>
                        <th className="sticky bg-white shadow-xs">Telp. Wali</th>
                        <th className="sticky bg-white shadow-xs">Email Wali</th>
                        <th className="sticky bg-white shadow-xs text-right">-</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.siswa.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center bold">{index+1}.</td>
                              <td className="text-center">
                                <div className="pointer user_avatar_xxs oh" data-toggle="modal" data-target="#add-img-mdl" onClick={() => this.setState({siswa_self:r})}>
                                  {
                                    r.avatar ?
                                    <img className="radius-20" src={con.img+'/siswa/thumb/'+r.avatar+'?'+Random.generate()} alt="img" onClick={() => this.setState({avatar:con.img + '/siswa/' + r.avatar})} /> :
                                    <i className="la la-siswa la-lg la-lg" onClick={() => this.setState({avatar:con.img + '/user.png'})} />
                                  }
                                </div>
                              </td>
                              <td className="bold text-nowrap">{r.nama}</td>
                              <td className="text-nowrap">
                                <span className="badge badge-light bolder p-1 f-8">{r.nis}</span>
                              </td>
                              <td className="text-nowrap f-8"><span className={`text-${r.gender === 1 ? 'info' : 'danger'} bolder`}>{r.gender === 1 ? 'Laki-laki' : 'Perempuan'}</span></td>
                              <td className="f-8 bolder text-nowrap">{moment().diff(r.lahir, 'years')} Tahun</td>
                              <td className="f-8 bolder text-nowrap"><Pop title="Keterangan" content={r.alamat} length="5" /></td>
                              <td className="text-nowrap">{r.wali_nama ? r.wali_nama+' ('+r.wali_status+')' : <i className="la la-times-circle text-danger" />}</td>
                              <td className="text-nowrap">{r.wali_tlp || <i className="la la-times-circle text-danger" />}</td>
                              <td className="bold f-9 text-nowrap">{r.wali_email}</td>
                              <td className="text-right text-nowrap">
                                <Link to={`/siswa/edit/${r.siswa_id}`} className="btn-fab btn-fab-xs btn-warning-light border border-warning mr-2"><i className="la la-pen"></i></Link>
                                <span className="btn-fab btn-fab-xs btn-danger-light border border-danger" data-toggle="modal" data-target="#delete-usr-mdl" onClick={() => this.setState({siswa_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='delete-usr-mdl' size='md' title='Hapus Siswa' body={<ModalDelete />} />
          <Modal id='add-img-mdl' size='sm' body={<ModalAddImg />} bodyClass="p-0" />
        </div>
      </div>
    );
  }
}
export default Siswa
