import React from 'react';
import axios from 'axios';
import con from '../api/connection';
import Skeleton from 'react-skeleton-loader';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import Input from '../misc/input';
import InputMask from 'react-input-mask';
import 'moment/locale/id';
import DatePicker from 'react-date-picker';
import Autocomplete from '../misc/autocomplete';
import Radio from '../misc/radio';
import Select from '../misc/select';
import Email from '../misc/email';
import Editor from '../misc/editor';
import Password from '../misc/password';
import Notif from '../misc/notif';
class Mask extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value:''
    }
  }
  UNSAFE_componentWillReceiveProps(props){
    this.setState({ value: props.value || '' });
  }
  change = (e) => {
    this.setState({ value: e.target.value });
  }
  render() {
    return (
      <div className={this.props.divClass}>
        <small className="text-nowrap">{this.props.title}</small>
        <div className="position-absolute t-1 r-1 bg-white radius-20 px-1 text-danger bold f-8 m-0">{this.props.value ? '' : (this.props.error || '')}</div>
        <InputMask name={this.props.name} value={this.state.value} onChange={this.change.bind(this)} mask={this.props.mask || '99999999999999999999'} maskChar={null} type="text" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder={this.props.placeholder} />
      </div>
    )
  }
}
class Lahir extends React.Component {
  constructor(props){
    super(props);
    this.state = { value:'' }
  }
  UNSAFE_componentWillReceiveProps(props){
    this.setState({ value: props.value ? new Date(props.value.split(' ').join('T')) : new Date() });
  }
  render() {
    return(
      <div className="col">
        <small className="text-nowrap">Tgl Lahir</small>
        <DatePicker name="lahir" onChange={(i) => this.setState({ value:i })} value={this.state.value} format="dd-MM-yyyy" className="bg-light d-block" calendarClassName="border-0 radius-10 shadow p-2" locale="id" clearIcon={null} calendarIcon={<i className="la la-calendar-alt text-primary la-2x"></i>} />
      </div>
    )
  }
}
class Image extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      avatar:null,
      value:''
    }
  }
  UNSAFE_componentWillReceiveProps(props){
    this.setState({ avatar: props.src ? con.img+'/siswa/'+props.src+'?'+new Date().getTime() : con.img+'/user-add.png' }, () => props.src && this.update());
  }
  update() {
    this.img.querySelector('img').classList.remove('opacity-1');
    this.img.querySelector('.remove').classList.remove('d-none');
  }
  change = (e) => {
    const img = e.target.closest('.crop').querySelector('img');
    img.cropper && img.cropper.destroy();
    if (e.target.files.length) {
      img.classList.remove('opacity-1');
      e.target.closest('.crop').querySelector('.jadikan').classList.remove('d-none');
      e.target.closest('.crop').querySelector('.remove').classList.add('d-none');
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.setState({ avatar: reader.result, value: reader.result });
        new Cropper(img, {
          aspectRatio: 1 / 1,
          viewMode: 2,
          dragMode: 'move',
          background: false,
          modal: false,
          zoomOnWheel: false,
          toggleDragModeOnDblclick: false,
          wheelZoomRatio: 1,
          autoCropArea: 1,
          scalable: false,
        });
      });
      reader.readAsDataURL(e.target.files[0]);
      e.target.closest('.crop').querySelector('input[type="file"]').value = null;
    }
  }
  getImg = (e) => {
    e.currentTarget.classList.add('d-none');
    e.currentTarget.closest('.crop').querySelector('.remove').classList.remove('d-none');
    const img = e.currentTarget.closest('.crop').querySelector('img');
    this.setState({
      avatar: img.cropper.getCroppedCanvas().toDataURL(),
      value:img.cropper.getCroppedCanvas().toDataURL()
    });
    img.cropper.destroy();
    e.currentTarget.closest('.crop').querySelector('input[type="file"]').value = null;
  }
  removeImg = (e) => {
    e.currentTarget.classList.add('d-none');
    const img = e.currentTarget.closest('.crop').querySelector('img');
    this.setState({
      avatar: con.img+'/user-add.png',
      value:'delete'
    });
    img.classList.add('opacity-1');
    e.currentTarget.closest('.crop').querySelector('input[type="file"]').value = null;
  }
  render() {
    return (
      <div ref={i => this.img = i} className={this.props.divClass}>
        <div className="p-1 border radius-10 crop">
          <input name={this.props.name} type="hidden" defaultValue={this.state.value} />
          {
            this.state.avatar ?
            <img src={this.state.avatar} alt="img" className="wpx-85 radius-5 opacity-1" />
            :
            <Skeleton width="85px" height="85px" borderRadius="10px" widthRandomness={0} />
          }
          <div className="d-flex align-items-center justify-content-center mt-1">
            <label className="col-auto btn-fab btn-fab-xs btn-info-light py-0 px-1 mb-0 pointer">
              <i className="la la-cloud-upload-alt" />
              <input type="file" className="d-none" accept=".png,.jpg,.jpeg" onChange={(e) => this.change(e)} />
            </label>
            <div className="col-auto btn-fab btn-fab-xs btn-success-light ml-1 py-0 px-1 pointer jadikan d-none" onClick={(e) => this.getImg(e)}>
              <i className="la la-check" />
            </div>
            <div className="col-auto btn-fab btn-fab-xs btn-danger-light ml-1 py-0 px-1 pointer remove d-none" onClick={(e) => this.removeImg(e)}>
              <i className="la la-times" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
class Siswa extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.siswa_id = this.props.match.params.siswa_id;
    this.state = {
      siswa:{kelas:{}},
      avatar:con.img+'/user-add.png',
      statusWali:[{id:'Ayah',text:'Ayah'},{id:'Ibu',text:'Ibu'},{id:'Saudara/i',text:'Saudara/i'}],
      notifBg:'success',
      notifMsg:''
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Tambah Siswa';
    this._isMounted && axios.get(con.api+'/siswa/detail/'+this.siswa_id, {headers:con.headers})
    .then(res => {
      if (res.data) {
        this.setState({ siswa:res.data });
      }else {
        this.props.history.push('/kurikulum/materi');
      }
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  submit(){
    let q = {siswa_id:this.state.siswa.siswa_id};
    q['nis'] = this.form.querySelector('input[name="nis"]').value;
    q['nama'] = this.form.querySelector('input[name="nama"]').value;
    q['kk'] = this.form.querySelector('input[name="kk"]').value;
    q['lahir'] = this.form.querySelector('input[name="lahir"]').value;
    q['alamat'] = this.form.querySelector('input[name="alamat"]').value;
    q['gender'] = this.form.querySelector('input[name="gender"]:checked').value;
    q['wali_status'] = this.form.querySelector('select[name="wali_status"]').value;
    q['wali_nama'] = this.form.querySelector('input[name="wali_nama"]').value;
    q['wali_tlp'] = this.form.querySelector('input[name="wali_tlp"]').value;
    q['wali_email'] = this.form.querySelector('input[name="wali_email"]').value;
    q['avatar'] = this.form.querySelector('input[name="avatar"]').value;
    q['password'] = this.form.querySelector('input[name="password"]').value;
    q['kelas_id'] = this.form.querySelector('select[name="kelas_id"]').value;
    q['status'] = this.form.querySelector('input[name="status"]:checked').value;
    let catatanCount = this.catatan.editor.value.replace(/<\/?[^>]+>/ig, "").length;
    if (catatanCount) q['catatan'] = this.catatan.editor.value;
    let isEmailValid = this.form.querySelector('input[name="wali_email"]').getAttribute('data-valid') === 'true';
    let allFilled =  Object.keys(q).filter((a) => (a !== 'avatar' && a !== 'password') ).every((i) => i !== "");
    let passwordCheck = q.password === '' || this.form.querySelector('input[name="password"]').getAttribute('data-accept') === 'true';
    if (allFilled && isEmailValid && passwordCheck && q.kelas_id) {
      axios.post(con.api+'/siswa/update', q, {headers:con.headers})
      .then(res => {
        this.setState({ siswa: res.data.update, notifBg:'success', notifMsg:'Data Siswa berhasil diupdate' }, () => document.querySelector('.notif-show').click());
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
                  <p className="text-capitalize m-0 lh-1 f-9 bolder text-primary mr-2">EDIT SISWA</p>
                </div>
              </div>
              <div className="card-body py-2" ref={i => this.form = i}>
                <div className="row mb-2 align-items-end">
                  <Image divClass="col-auto text-center" name="avatar" src={this.state.siswa.avatar} />
                  <div className="col">
                    <div className="row">
                      <Input name="nis" value={this.state.siswa.nis} title="Nomor Identitas Siswa" divClass="col" note="*NIS dibuat otomatis oleh sistem" readOnly />
                      <Input name="nama" value={this.state.siswa.nama} title="Nama Siswa" divClass="col" error="*Nama Siswa harus di isi" placeholder="Isi dengan nama lengkap" capital />
                    </div>
                    <div className="row">
                      <Mask name="kk" value={this.state.siswa.kk} divClass="col" placeholder="Isi dengan angka" error="*Kartu Keluarga harus diisi" title="Kartu Keluarga" />
                      <Lahir value={this.state.siswa.lahir} />
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <Autocomplete name="alamat" value={this.state.siswa.alamat} divClass="col" title="Alamat" api="lokasi" placeholder="Cari alamat" error="*Alamat harus di isi" />
                    {
                      this.state.siswa.gender !== undefined ?
                      <div className="col-auto pt-2">
                        <Radio name="gender" setOption={{1:'Laki-laki', 0:'Perempuan'}} checked={this.state.siswa.gender} />
                      </div>
                      :
                      <div className="col-auto">
                        <Skeleton height="15px" widthRandomness={0} />
                        <br/>
                        <Skeleton height="30px" widthRandomness={0} />
                      </div>
                    }
                </div>
                <div className="row align-items-center py-3">
                  <div className="col px-0"><hr className="m-0" /></div>
                  <div className="col-auto"><span className="alert alert-info py-1 bolder">Informasi Wali</span></div>
                  <div className="col px-0"><hr className="m-0" /></div>
                </div>
                <div className="row mb-2">
                  {
                    this.state.siswa.wali_status !== undefined ?
                    <Select name="wali_status" title="Status Wali" className="col" data={this.state.statusWali} placeholder="Pilih Status Wali" selected={['Ibu', 'Ibu']} />
                    :
                    <div className="col">
                      <Skeleton width="50%" height="10px" widthRandomness={0} />
                      <Skeleton width="100%" height="30px" widthRandomness={0} />
                    </div>
                  }
                  <Input name="wali_nama" value={this.state.siswa.wali_nama} title="Nama Wali" divClass="col" error="*Nama Wali harus di isi" placeholder="Isi dengan nama lengkap" capital />
                </div>
                <div className="row mb-2">
                  <Mask name="wali_tlp" value={this.state.siswa.wali_tlp} title="Telp. Wali" error="*Telp. Wali harus di isi" mask="999999999999" divClass="col" placeholder="Isi dengan angka" />
                  <Email name="wali_email" value={this.state.siswa.wali_email} divClass="col" title="Email Wali" placeholder="Email" />
                </div>
                <div className="row align-items-center py-3">
                  <div className="col px-0"><hr className="m-0" /></div>
                  <div className="col-auto"><span className="alert alert-info py-1 bolder">Tentang Siswa</span></div>
                  <div className="col px-0"><hr className="m-0" /></div>
                </div>
                <div className="row">
                  <Editor optMin value={this.state.siswa.catatan} ref={i => this.catatan = i} title="Catatan Siswa" divClass="col" placeholder="Catatan siswa seperti prestasi, bakat, hobi, atau kelebihan dan kekurangan siswa" />
                </div>
                <div className="row align-items-center py-3">
                  <div className="col px-0"><hr className="m-0" /></div>
                  <div className="col-auto"><span className="alert alert-info py-1 bolder">Pengaturan Akun</span></div>
                  <div className="col px-0"><hr className="m-0" /></div>
                </div>
                <div className="d-flex pb-2">
                  <div className="col alert alert-warning py-1" role="alert">
                    <i className="la la-lg la-exclamation-triangle mr-2" />
                    Kosongkan jika tidak ingin mengganti password
                    <i className="la la-times la-lg float-right pt-1" data-dismiss="alert" />
                  </div>
                </div>
                <div className="row mb-2">
                  <Password name="password" length="4" capital={false} number={false} divClass="col-md-6 offset-md-3 text-center" title="Ganti Password" placeholder="Ganti Password" />
                </div>
                <div className="row mb-2">
                  <div className="col text-center text-info"><u>Status Siswa</u></div>
                </div>
                <div className="row mb-2">
                  {
                    this.state.siswa.kelas_id ?
                    <Select name="kelas_id" title="Kelas" className="col-md-4 offset-md-4 text-center" error="*Kelas harus di isi" url='kelas/select' placeholder="Pilih Kelas" selected={[this.state.siswa.kelas.kelas_id, this.state.siswa.kelas.nama]} />
                    :
                    <Select name="kelas_id" title="Kelas" className="col-md-4 offset-md-4 text-center" error="*Kelas harus di isi" url='kelas/select' placeholder="Pilih Kelas" />
                  }
                </div>
                <div className="row mb-2">
                  {
                    this.state.siswa.status !== undefined ?
                    <div className="col text-center pt-2">
                      <Radio name="status" setOption={{0:'Siswa Nonaktif', 1:'Siswa Aktif', 2:'Lulus', 3:'Daftar', 4:'Pindahan'}} checked={this.state.siswa.status} divClass="justify-content-center" />
                    </div>
                    :
                    <div className="col text-center">
                      <Skeleton height="15px" widthRandomness={0} />
                      <br/>
                      <Skeleton height="30px" widthRandomness={0} />
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed-bottom p-3 bg-white z-99 shadow-lg border-top">
          <div className="text-right">
            <span onClick={this.props.history.goBack} className="alert alert-light py-2 mr-2 pointer">KEMBALI</span>
            {
              this.state.siswa.siswa_id !== undefined ?
              <span className="alert alert-success py-2 px-4 pointer" onClick={this.submit.bind(this)}>PROSES</span>
              :
              <span className="alert p-0 m-0"><Skeleton width="90px" height="100%" widthRandomness={0} /></span>
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Siswa
