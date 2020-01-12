import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import con from '../api/connection';
import Editor from '../misc/editor';
import Notif from '../misc/notif';
const PlaceModul = () => {
  return '<small>Contoh:</small> <br /> <ol>'+
  '<li class="f-8"> Jamil, Reja. '+new Date().getFullYear()+'. Ilmu Komputer SMA kelas X. Bandung </li>'+
  '<li class="f-8"> Agung Feryanto, dkk. 2012. PR Ekonomi untuk SMA/MA kelas X semester 1, PT Intan pariwara </li>'+
  '</ol>';
}
class Materi extends React.Component {
  constructor(props){
    super(props);
    this.materi_id = this.props.match.params.materi_id;
    this.state = {
      materi:'',
      data:{kelas:'',semester:'',mapel:'',sk:'', kd:''},
      notifBg:'success',
      notifMsg:''
    }
  }
  componentDidMount() {
    axios.get(con.api+'/kurikulum/materi/detail/'+this.materi_id, {headers:con.headers}).then(res => {
      if (res.data) {
        this.setState({
          materi:res.data,
          data:{
            kelas:res.data.kelas,
            semester:res.data.semester,
            mapel:res.data.mapel,
            sk:res.data.silabus.sk,
            kd:res.data.rpp.kd
          }
        });
      }else {
        this.props.history.push('/kurikulum/materi');
      }
    });
  }
  submit(){
    let q = {materi_id:this.materi_id};
    q['materi'] = this.modul.editor.value;
    let modulCount = this.modul.editor.value.replace(/<\/?[^>]+>/ig, "").length;
    if (modulCount > 0) {
      axios.post(con.api+'/kurikulum/materi/update', q, {headers:con.headers})
      .then(res => {
        this.setState({
          materi:res.data.materi,
          data:{
            kelas:res.data.materi.kelas,
            semester:res.data.materi.semester,
            mapel:res.data.materi.mapel,
            sk:res.data.materi.silabus.sk,
            kd:res.data.materi.rpp.kd
          }
        });
        this.setState({ notifBg:'success', notifMsg:'Materi berhasil diupdate' }, () => document.querySelector('.notif-show').click());
      });
    }else {
      this.setState({ notifBg:'danger', notifMsg:'Mohon periksa kembali kelengkapan data yang harus di isi' }, () => document.querySelector('.notif-show').click());
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="d-flex pb-5">
          <div className="col-12 p-0">
            <Notif close duration="5000" bg={this.state.notifBg} v="bottom" h="center" message={this.state.notifMsg} />
            <div className="card no-b shadow-lg ov">
              <div className="card-header bg-white b-0 px-3 py-2 radius-10">
                <div className="d-flex align-items-center">
                  <div className="square-30 bg-primary-light text-primary radius-30 d-flex align-items-center justify-content-center mr-2">
                    <Link to="/kurikulum/materi" className="la la-arrow-left la-lg"/>
                  </div>
                  <p className="text-capitalize m-0 lh-1 f-9 bolder text-primary mr-2">{this.state.materi.nama}</p>
                  <p className="text-capitalize m-0 lh-1 f-8 bold">{`(${this.state.data.mapel}, Kls. ${this.state.data.kelas})`}</p>
                </div>
              </div>
              <div className="card-body p-0" ref={i => this.form = i}>
                <div className="row">
                  <Editor value={this.state.materi.materi} ref={i => this.modul = i} divClass="col" placeholder={PlaceModul()} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed-bottom p-3 bg-white z-99 shadow-lg border-top">
          <div className="text-right">
            <Link to="/kurikulum/materi" className="alert alert-light py-2 mr-2">KEMBALI</Link>
            <span className="btn btn-xs btn-success py-1 px-3 radius-5 pointer f-12" onClick={this.submit.bind(this)}>UPDATE</span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Materi
