import React from 'react'
import axios from 'axios';
import con from '../api/connection';
import moment from 'moment';
import 'moment/locale/id';
import MomentUtils from '@date-io/moment'; // choose your lib
import { TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Skeleton from 'react-skeleton-loader';
import Select from '../misc/select';
import Modal from '../misc/modal';
import Notif from '../misc/notif';
class JadwalDetail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      kelas:props.kelas,
      hari:props.hari,
      loading:true,
      jadwal:[],
      jadwal_self:{kelas:{},hari:{},mapel:{}},
      start:new Date(Math.round(new Date().getTime() / (1000*60*5)) * (1000*60*5)),
      end:new Date(Math.round(new Date().getTime() / (1000*60*5)) * (1000*60*5)),
      startDisabled:false,
      endDisabled:true,
      notifBg:'success',
      notifMsg:''
    }
  }
  UNSAFE_componentWillReceiveProps(props) {
    this.setState({ kelas: props.kelas, hari: props.hari, loading:true });
    axios.get(con.api+'/mapel/jadwal', {headers:con.headers, params:{kelas_id:props.kelas.kelas_id, hari_id:props.hari.hari_id}}).then(res => {
      this.setState({ jadwal:res.data.jadwal, loading:false });
    });
  }
  showNotif(color, msg){
    return this.setState({ notifBg:color, notifMsg:msg }, () => document.querySelector('.notif-show').click());
  }
  checkTime(){
    axios.get(con.api+'/mapel/jadwal/check', {headers:con.headers, params:{kelas_id:this.state.kelas.kelas_id, hari_id:this.state.hari.hari_id}}).then(res => {
      if (res.data) {
        const time = moment().set({'hour':parseInt(res.data.end.split(':')[0]), 'minute':parseInt(res.data.end.split(':')[1])});
        this.setState({ start:time.toDate(), end:time.add(30, 'minutes').toDate(), startDisabled:true, endDisabled:false });
      }else {
        this.setState({ startDisabled: false, endDisabled:true });
      }
    });
  }
  changeStart(i){
    this.setState({ start:i, endDisabled:false }, () => {
      if (moment(this.state.end).isSameOrBefore(i)) {
        const end = moment(this.state.end);
        this.setState({ end: end.set('hour', i.get('hour')).add(30, 'minutes') });
      }
    });
  }
  changeEnd(i){
    if (i.isAfter(this.state.start)) {
      this.setState({ end: i });
    }
  }
  add(e){
    e.preventDefault();
    const q = {kelas_id:this.state.kelas.kelas_id, hari_id:this.state.hari.hari_id};
    q['mapel_id'] = this.addForm.querySelector('select[name="mapel_id"]').value;
    q['start'] = this.addForm.querySelector('input[name="start"]').value;
    q['end'] = this.addForm.querySelector('input[name="end"]').value;
    if (q.start && q.end) {
      axios.post(con.api+'/mapel/jadwal/store', q, {headers:con.headers})
      .then(res => {
        this.setState({ jadwal:res.data.jadwal });
      });
    }
  }
  edit(e){
    e.preventDefault();
    const q = {jadwal_id:this.state.jadwal_self.jadwal_id, kelas_id:this.state.kelas.kelas_id, hari_id:this.state.hari.hari_id};
    q['mapel_id'] = this.editForm.querySelector('select[name="mapel_id"]').value;
    axios.post(con.api+'/mapel/jadwal/update', q, {headers:con.headers})
    .then(res => {
      this.setState({ jadwal:res.data.jadwal });
    });
  }
  istirahat(e){
    e.preventDefault();
    const q = {jadwal_id:this.state.jadwal_self.jadwal_id, kelas_id:this.state.kelas.kelas_id, hari_id:this.state.hari.hari_id};
    axios.post(con.api+'/mapel/jadwal/update', q, {headers:con.headers})
    .then(res => {
      this.setState({ jadwal:res.data.jadwal });
    });
  }
  start(e){
    e.preventDefault();
    const q = {jadwal_id:this.state.jadwal_self.jadwal_id, kelas_id:this.state.kelas.kelas_id, hari_id:this.state.hari.hari_id};
    q['start'] = this.startForm.querySelector('input[name="start"]').value;
    const start = moment().set({'hour':parseInt(q.start.split(':')[0]), 'minute':parseInt(q.start.split(':')[1]), 'second':0});
    const end = moment().set({'hour':parseInt(this.state.jadwal_self.end.split(':')[0]), 'minute':parseInt(this.state.jadwal_self.end.split(':')[1]), 'second':0});
    if (start.isBefore(end)) {
      axios.post(con.api+'/mapel/jadwal/update/start', q, {headers:con.headers}).then(res => {
        this.setState({ jadwal:res.data.jadwal }, () => this.showNotif('success', 'Berhasil merubah jam masuk'));
      });
    }else {
      this.showNotif('danger', 'Jam masuk tidak boleh melebihi jam habis mata pelajaran');
    }
  }
  end(e){
    e.preventDefault();
    const q = {jadwal_id:this.state.jadwal_self.jadwal_id, kelas_id:this.state.kelas.kelas_id, hari_id:this.state.hari.hari_id};
    q['end'] = this.endForm.querySelector('input[name="end"]').value;
    const end = moment().set({'hour':parseInt(q.end.split(':')[0]), 'minute':parseInt(q.end.split(':')[1]), 'second':0});
    const start = moment().set({'hour':parseInt(this.state.jadwal_self.start.split(':')[0]), 'minute':parseInt(this.state.jadwal_self.start.split(':')[1]), 'second':0});
    if (start.isBefore(end)) {
      axios.post(con.api+'/mapel/jadwal/update/end', q, {headers:con.headers}).then(res => {
        this.setState({ jadwal:res.data.jadwal }, () => this.showNotif('success', 'Berhasil merubah jam keluar'));
      });
    }else {
      this.showNotif('danger', 'Jam keluar tidak boleh kurang dari jam masuk pelajaran');
    }
  }
  delete(e){
    e.preventDefault();
    const q = {jadwal_id:this.state.jadwal_self.jadwal_id, kelas_id:this.state.kelas.kelas_id, hari_id:this.state.hari.hari_id};
    axios.post(con.api+'/mapel/jadwal/delete', q, {headers:con.headers}).then(res => {
      console.log(res.data);
      this.setState({ jadwal:res.data.jadwal });
    });
  }
  render () {
    const ModalAdd = () => {
      return (
        <div ref={i => this.addForm = i}>
          <div className="row">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div className="col mb-2">
                <small>Dari Pukul</small>
                <TimePicker name="start" disabled={this.state.startDisabled} value={this.state.start} ampm={false} minutesStep={5} onChange={(i) => this.changeStart(i)} variant="dialog" />
              </div>
              <div className="col mb-2">
                <small>Sampai Pukul</small>
                <TimePicker name="end" disabled={this.state.endDisabled} value={this.state.end} ampm={false} minutesStep={5} onChange={(i) => this.changeEnd(i)} variant="dialog" />
              </div>
            </MuiPickersUtilsProvider>
          </div>
          <div className="row">
            <Select name="mapel_id" title="Pilih Mata Pelajaran" className="col-12 mb-2" url="kurikulum/mapel/select" placeholder="Pilih Mata Pelajaran" error="*Mata Pelajaran harus di isi" />
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
    const ModalStart = () => {
      const [startTime, onStartTime] = React.useState(this.state.jadwal_self.start && moment().set({'hour':parseInt(this.state.jadwal_self.start.split(':')[0]), 'minute':parseInt(this.state.jadwal_self.start.split(':')[1])}));
      return (
        <div ref={i => this.startForm = i}>
          <div className="row">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div className="col p-0 text-center">
                {
                  this.state.jadwal_self.end ?
                  <React.Fragment>
                    <TimePicker value={startTime} ampm={false} minutesStep={5} onChange={(i) => onStartTime(i)} variant="static" />
                    <input type="hidden" name="start" value={startTime.format('HH:mm:[00]')} />
                  </React.Fragment> : ''
                }
              </div>
            </MuiPickersUtilsProvider>
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-center">
              <button className="alert alert-light py-1 px-4 pointer mr-2" data-dismiss="modal"> Tutup </button>
              <button className="alert alert-success py-1 px-4 pointer" onClick={this.start.bind(this)} data-dismiss="modal"> Proses </button>
            </div>
          </div>
        </div>
      )
    }
    const ModalEnd = () => {
      const [endTime, onEndTime] = React.useState(this.state.jadwal_self.end && moment().set({'hour':parseInt(this.state.jadwal_self.end.split(':')[0]), 'minute':parseInt(this.state.jadwal_self.end.split(':')[1])}));
      return (
        <div ref={i => this.endForm = i}>
          <div className="row">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div className="col p-0 text-center">
                {
                  this.state.jadwal_self.end ?
                  <React.Fragment>
                    <TimePicker value={endTime} ampm={false} minutesStep={5} onChange={(i) => onEndTime(i)} variant="static" />
                    <input type="hidden" name="end" value={endTime.format('HH:mm:[00]')} />
                  </React.Fragment> : ''
                }
              </div>
            </MuiPickersUtilsProvider>
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-center">
              <button className="alert alert-light py-1 px-4 pointer mr-2" data-dismiss="modal"> Tutup </button>
              <button className="alert alert-success py-1 px-4 pointer" onClick={this.end.bind(this)} data-dismiss="modal"> Proses </button>
            </div>
          </div>
        </div>
      )
    }
    const ModalEdit = () => {
      return (
        <div ref={i => this.editForm = i}>
          <div className="row">
            {
              this.state.jadwal_self.mapel ?
              <Select selected={[this.state.jadwal_self.mapel.mapel_id, this.state.jadwal_self.mapel.nama]} name="mapel_id" title="Pilih Mata Pelajaran" className="col-12 mb-2" url="kurikulum/mapel/select" placeholder="Pilih Mata Pelajaran" error="*Kosongkan jika waktu istirahat" />
              :
              <Select name="mapel_id" title="Pilih Mata Pelajaran" className="col-12 mb-2" url="kurikulum/mapel/select" placeholder="Pilih Mata Pelajaran" error="*Kosongkan jika waktu istirahat" />
            }
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="alert alert-light py-1 px-4 pointer mr-2" data-dismiss="modal"> Tutup </button>
              { this.state.jadwal_self.mapel && <button className="alert alert-warning py-1 px-4 pointer mr-2" onClick={this.istirahat.bind(this)} data-dismiss="modal"> Atur Sebagai Istirahat </button> }
              <button className="alert alert-success py-1 px-4 pointer" onClick={this.edit.bind(this)} data-dismiss="modal"> Proses </button>
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
              <p className="bg-light p-2 m-0 lh-15 radius-10">
                Apakah anda yakin ingin menghapus jadwal {this.state.jadwal_self.mapel && 'mata pelajaran'} <span className="text-danger bolder h5">{this.state.jadwal_self.mapel ? this.state.jadwal_self.mapel.nama : 'Istirahat'}</span> ?
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
    return(
      <div className="row">
        <Notif close duration="5000" bg={this.state.notifBg} v="bottom" h="center" message={this.state.notifMsg} />
        {
          this.state.loading ?
          <div className="col">
            <div className="mb-3">
              <Skeleton width="100%" height="50px" borderRadius="10px" widthRandomness={0} />
            </div>
            <div className="row">
              <div className="col-auto mb-4"> <Skeleton width="35px" height="35px" borderRadius="35px" widthRandomness={0} /></div>
              <div className="col mb-4"> <Skeleton width="100%" height="35px" borderRadius="10px" widthRandomness={0} /> <Skeleton width="100%" height="15px" borderRadius="10px" widthRandomness={0.5} count={2} /> </div>
            </div>
            <div className="row">
              <div className="col-auto mb-4"> <Skeleton width="35px" height="35px" borderRadius="35px" widthRandomness={0} /></div>
              <div className="col mb-4"> <Skeleton width="100%" height="35px" borderRadius="10px" widthRandomness={0} /> <Skeleton width="100%" height="15px" borderRadius="10px" widthRandomness={0.5} count={2} /> </div>
            </div>
          </div>
          :
          <div className="col">
            <div className="p-2 f-14 radius-5 mb-3 d-flex align-items-center">
              <div>
                Jadwal Pelajaran kelas <span className="bolder">{this.state.kelas.nama}</span> hari <span className="bolder">{this.state.hari.nama}</span>
            </div>
            <div className="ml-auto">
              <span className="py-1 radius-5 pointer f-9 bolder text-info" data-toggle="modal" data-target="#tambah-mdl" onClick={this.checkTime.bind(this)}><i className="la la-plus mr-2" />Tambah Mata Pelajaran</span>
            </div>
          </div>
          {
            this.state.jadwal.map((r, index) => (
              <div className="activity-item activity-info" key={index}>
                <div className="activity-content">
                  <small className="text-dark bolder">
                    <i className="la la-clock text-info"></i>
                    <span className="bg-info-light text-info px-1 radius-10 pointer mx-1" data-toggle="modal" data-target="#start-mdl" onClick={() => this.setState({ jadwal_self:r })}> {r.start.split(':')[0]+':'+r.start.split(':')[1]} </span>
                    -
                    <span className="bg-warning-light text-warning px-1 radius-10 pointer ml-1" data-toggle="modal" data-target="#end-mdl" onClick={() => this.setState({ jadwal_self:r })}> {r.end.split(':')[0]+':'+r.end.split(':')[1]} </span>
                  </small>
                  <div className="shadow-xs p-2 radius-5 mb-3 d-flex align-items-center">
                    <div className={`${r.mapel ? 'text-info' : 'text-warning'}`}>
                      {r.mapel ? r.mapel.nama : 'Istirahat'}
                      {r.mapel && <p className="f-9 bolder text-dark mb-0 mt-2">Pengajar : { r.pengajar ? r.pengajar.nama : '-' } </p>}
                    </div>
                    <div className="ml-auto">
                      <span className="btn-fab btn-fab-xs btn-warning-light border border-warning mr-2" data-toggle="modal" data-target="#edit-mdl" onClick={() => this.setState({ jadwal_self:r })}><i className="la la-pen t-0" /></span>
                      <span className="btn-fab btn-fab-xs btn-danger-light border border-danger" data-toggle="modal" data-target="#delete-mdl" onClick={() => this.setState({ jadwal_self:r })}><i className="la la-trash t-0" /></span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
          <Modal id='tambah-mdl' size='md' title='Tambah Kategori' body={<ModalAdd />} />
          <Modal id='edit-mdl' size='md' title='Tambah Kategori' body={<ModalEdit />} />
          <Modal id='start-mdl' size='md' title='Tambah Kategori' bodyClass={`pt-0`} headerDisabled body={<ModalStart />} />
          <Modal id='end-mdl' size='md' title='Tambah Kategori' bodyClass={`pt-0`} headerDisabled body={<ModalEnd />} />
          <Modal id='delete-mdl' size='md' title='Tambah Kategori' body={<ModalDelete />} />
        </div>
      }
      </div>
    )
  }
}

export default JadwalDetail;
