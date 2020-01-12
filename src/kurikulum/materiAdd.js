import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import con from '../api/connection';
import Input from '../misc/input';
import Select from '../misc/select';
import Editor from '../misc/editor';
import Notif from '../misc/notif';
const PlaceSumber = () => {
  return '<small>Contoh:</small> <br /> <ol>'+
  '<li class="f-8"> Jamil, Reja. '+new Date().getFullYear()+'. Ilmu Komputer SMA kelas X. Bandung </li>'+
  '<li class="f-8"> Agung Feryanto, dkk. 2012. PR Ekonomi untuk SMA/MA kelas X semester 1, PT Intan pariwara </li>'+
  '</ol>';
}
const PlaceKegiatan = () => {
  return '<small>Contoh:</small> <br /> <ol>'+
    '<li class="f-8"> Guru menjelaskan </li>'+
    '<li class="f-8"> Siswa dibagi menjadi beberapa kelompok </li>'+
    '<li class="f-8"> Setiap kelompok membuat pertanyaan </li>'+
    '<li class="f-8"> Sesi tanya jawab antar kelompok </li>'+
  '</ol>';
}
class Materi extends React.Component {
  state = {
    showInfo:false,
    data:{kelas:'',semester:'',mapel:'',sk:''},
    notifBg:'success',
    notifMsg:''
  }
  componentDidMount() {
    document.title = 'Tambah Materi';
  }
  rpp_id(i){
    this.setState({ showInfo:true }, () => this.check(i));
  }
  check(rpp_id){
    axios.get(con.api+'/kurikulum/rpp/detail/'+rpp_id, {headers:con.headers})
    .then(res => {
      this.setState({ data:res.data, showInfo:true });
    });
  }
  submit(){
    let q = {};
    q['rpp_id'] = this.form.querySelector('select[name="rpp_id"]').value;
    q['nama'] = this.form.querySelector('input[name="nama"]').value;
    q['indikator'] = this.form.querySelector('input[name="indikator"]').value;
    q['metode'] = this.form.querySelector('input[name="metode"]').value;
    q['sumber'] = this.sumber.editor.value;
    q['kegiatan'] = this.kegiatan.editor.value;
    let sumberCount = this.sumber.editor.value.replace(/<\/?[^>]+>/ig, "").length;
    let kegiatanCount = this.kegiatan.editor.value.replace(/<\/?[^>]+>/ig, "").length;
    let allFilled = Object.values(q).every((i) => i !== "");
    if (allFilled && sumberCount > 0 && kegiatanCount > 0) {
      axios.post(con.api+'/kurikulum/materi/store', q, {headers:con.headers})
      .then(res => {
        this.setState({ notifBg:'success', notifMsg:'Materi berhasil disimpan' }, () => document.querySelector('.notif-show').click());
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
            <div className="card no-b shadow-lg radius-10">
              <div className="card-header bg-white b-0 px-3 py-2">
                <div className="d-flex align-items-center">
                  <div className="square-30 bg-primary-light text-primary radius-30 d-flex align-items-center justify-content-center mr-2 pointer">
                    <i onClick={this.props.history.goBack} className="la la-arrow-left la-lg"/>
                  </div>
                  <p className="text-capitalize m-0 lh-1 f-9 bolder text-primary mr-2">TAMBAH MATERI</p>
                </div>
              </div>
              <div className="card-body py-2" ref={i => this.form = i}>
                {
                  this.state.showInfo ?
                  <React.Fragment>
                    <div className="row align-items-center">
                      <div className="col-auto pr-0">
                        <div className="alert alert-success py-0 pr-2 pl-1 f-10 my-2 radius-30"><i className="la la-info" />Informasi silabus yang dipilih</div>
                      </div>
                      <div className="col"><hr/></div>
                    </div>
                    <div className="row">
                      <div className="col-auto">
                        <table className="table w-auto radius-10 mb-3 alert alert-warning border-warning" id="table-rpp">
                          <tbody>
                            <tr><td className="px-2 no-b f-8">Kelas</td><td className="no-b f-8">:</td><td className="text-capitalize px-2 no-b f-8">{this.state.data.kelas}</td></tr>
                            <tr><td className="px-2 no-b f-8">Semester</td><td className="no-b f-8">:</td><td className="text-capitalize px-2 no-b f-8">{this.state.data.semester}</td></tr>
                            <tr><td className="px-2 no-b f-8">Mata Pelajaran</td><td className="no-b f-8">:</td><td className="text-capitalize px-2 no-b f-8">{this.state.data.mapel}</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-auto">
                        <table className="table w-auto radius-10 mb-3 alert alert-success border-success" id="table-rpp">
                          <tbody>
                            <tr><td className="px-2 no-b f-8 bolder">Standar Kompetensi</td><td className="no-b f-8 bolder">:</td><td className="text-capitalize px-2 no-b f-8 bolder">{this.state.data.sk}</td></tr>
                            <tr><td className="px-2 no-b f-8 bolder">Kompetensi Dasar</td><td className="no-b f-8 bolder">:</td><td className="text-capitalize px-2 no-b f-8 bolder">{this.state.data.kd}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <hr className="my-2"/>
                  </React.Fragment> : ''
                }
                <div className="row mb-2">
                  <Select onChange={this.rpp_id.bind(this)} name="rpp_id" title="Kompetensi Dasar" className="col" error="*Kompetensi Dasar harus di isi" url='kurikulum/rpp/select' placeholder="Pilih Kompetensi Dasar" />
                  <Input name="nama" title="Nama Materi" divClass="col mb-2" error="*Nama Materi harus di isi" placeholder="Contoh: Pengertian Ekonomi" className="text-capitalize" />
                </div>
                <div className="row">
                  <Input name="indikator" title="Indikator Materi" divClass="col-md-6 mb-2" error="*Indikator Materi harus di isi" placeholder="Contoh: Siswa dapat menjelaskan Definisi Ekonomi" className="text-capitalize" />
                  <Input name="metode" title="Metode Pembelajaran" divClass="col-md-6 mb-2" error="*Metode Pembelajaran harus di isi" placeholder="Contoh: Online, Ceramah, Diskusi, Tanya Jawab, dll" className="text-capitalize" />
                </div>
                <div className="row">
                  <Editor optMin ref={i => this.sumber = i} title="Sumber Materi" divClass="col" error="*Sumber Materi harus di isi" placeholder={PlaceSumber()} />
                  <Editor optMin ref={i => this.kegiatan = i} title="Kegiatan Belajar" divClass="col" error="*Kegiatan Pembelajaran harus di isi" placeholder={PlaceKegiatan()} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed-bottom p-3 bg-white z-99 shadow-lg border-top">
          <div className="text-right">
            <Link to="/kurikulum/materi" className="alert alert-light py-2 mr-2">KEMBALI</Link>
            <span className="alert alert-success py-2 px-4 pointer" onClick={this.submit.bind(this)}>PROSES</span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Materi
