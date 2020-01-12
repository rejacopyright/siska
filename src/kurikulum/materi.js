import React from 'react';
import {Link} from "react-router-dom";
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import con from '../api/connection';
import { Scrollbars } from 'react-custom-scrollbars';
import Modal from '../misc/modal';

class Materi extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      materi:[],
      materi_page:1,
      materi_search:'',
      materi_self:{silabus:{},kelas:{},semester:{},mapel:{}},
      loading:true
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Materi';
    this._isMounted && axios.get(con.api+'/kurikulum/materi', {headers:con.headers, params:{page:this.state.materi_page}})
    .then(res => {
      this.setState({ materi:res.data.materi, loading:false });
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  delete(e){
    let q = {materi_id: this.state.materi_self.materi_id};
    axios.post(con.api+'/kurikulum/materi/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ materi:res.data.materi });
      document.getElementById('table-materi').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/kurikulum/materi', {headers:con.headers, params:{page:this.state.materi_page + 1, q:this.state.materi_search}})
      .then(res => {
        if (res.data.materi.length) {
          this.setState({ materi:this.state.materi.concat(res.data.materi), materi_page:this.state.materi_page + 1, loading:false });
        }
      });
    }
  }
  searcMateri(e){
    axios.get(con.api+'/kurikulum/materi', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ materi:res.data.materi, materi_page:1, materi_search:res.config.params.q });
    });
  }
  render() {
    const ModalDelete = () => {
      return (
        <React.Fragment>
          <div className="row mb-2">
            <div className="col text-center">
              <p className="m-0 lh-15 py-2 alert alert-warning">
                Menghapus materi menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus materi <span className="text-danger strong h5">{'"'+(this.state.materi_self.nama || '').toUpperCase()+'"'}</span> ?
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
                    <input onChange={this.searcMateri.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Pencarian" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto text-right">
                  <Link to="/kurikulum/materi/add" className="alert alert-info py-1 px-2 pointer f-9"><i className="la la-plus mr-1"></i><strong>Tambah Materi</strong></Link>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover mb-0" id="table-materi">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs">Kelas</th>
                        <th className="sticky bg-white shadow-xs">Semester</th>
                        <th className="sticky bg-white shadow-xs">Mata Pelajaran</th>
                        <th className="sticky bg-white shadow-xs">Standar Kompetensi</th>
                        <th className="sticky bg-white shadow-xs">Standar Kompetensi</th>
                        <th className="sticky bg-white shadow-xs" colSpan={2}>Materi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.materi.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center font-bold">{index+1}.</td>
                              <td className="bold text-nowrap">{r.kelas}</td>
                              <td className="bold text-nowrap text-capitalize">{r.semester}</td>
                              <td className="bold text-nowrap">{r.mapel}</td>
                              <td className="bold">{r.sk}</td>
                              <td className="bold">{r.kd}</td>
                              <td className="bold">{r.nama}</td>
                              <td className="text-right text-nowrap">
                                <Link to={`/kurikulum/materi/modul/${(r.materi_id)}`} className="btn-fab btn-fab-xs btn-info-light mr-2"><i className="la la-book-open"></i></Link>
                                <Link to={`/kurikulum/materi/edit/${(r.materi_id)}`} className="btn-fab btn-fab-xs btn-warning-light mr-2"><i className="la la-pen"></i></Link>
                                <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-mdl" onClick={() => this.setState({materi_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='delete-mdl' size='md' title='Hapus Materi' body={<ModalDelete />} />
        </div>
      </div>
    );
  }
}
export default Materi
