import React from 'react';
import axios from 'axios';
import con from '../api/connection';
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
import Notif from '../misc/notif';
function Mask(props){
  const [value, setValue] = React.useState(props.value);
  const change = (e) => {
    setValue(e.target.value);
  }
  return (
    <div className={props.divClass}>
      <small className="text-nowrap">{props.title}</small>
      <div className="position-absolute r-1 bg-white radius-20 px-1 text-danger bold f-8 m-0" style={{top:'8px'}}>{value ? '' : (props.error || '')}</div>
      <InputMask name={props.name} defaultValue={value} onChange={change} mask={props.mask || '99999999999999999999'} maskChar={null} type="text" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder={props.placeholder} />
    </div>
  )
}
function Lahir() {
  const [dateValue, setDateValue] = React.useState(new Date());
  return(
    <div className="col">
      <small className="text-nowrap">Tgl Lahir</small>
      <DatePicker name="lahir" onChange={(i) => setDateValue(i)} value={dateValue} format="dd-MM-yyyy" className="bg-light d-block" calendarClassName="border-0 radius-10 shadow p-2" locale="id" clearIcon={null} calendarIcon={<i className="la la-calendar-alt text-primary la-2x"></i>} />
    </div>
  )
}
function Image(props){
  const [avatar, setAvatar] = React.useState(con.img+'/user-add.png');
  const [value, setValue] = React.useState('');
  const change = (e) => {
    const img = e.target.closest('.crop').querySelector('img');
    e.target.closest('.crop').querySelector('.title').innerText = 'Ganti';
    img.cropper && img.cropper.destroy();
    if (e.target.files.length) {
      img.classList.remove('opacity-1');
      e.target.closest('.crop').querySelector('.jadikan').classList.remove('d-none');
      e.target.closest('.crop').querySelector('.remove').classList.add('d-none');
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        setAvatar(reader.result);
        setValue(reader.result);
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
  const getImg = (e) => {
    e.target.classList.add('d-none');
    e.target.closest('.crop').querySelector('.remove').classList.remove('d-none');
    const img = e.target.closest('.crop').querySelector('img');
    setAvatar(img.cropper.getCroppedCanvas().toDataURL());
    setValue(img.cropper.getCroppedCanvas().toDataURL());
    img.cropper.destroy();
    e.target.closest('.crop').querySelector('input[type="file"]').value = null;
  }
  const removeImg = (e) => {
    e.target.classList.add('d-none');
    const img = e.target.closest('.crop').querySelector('img');
    setAvatar(con.img+'/user-add.png');
    setValue('');
    img.classList.add('opacity-1');
    e.target.closest('.crop').querySelector('input[type="file"]').value = null;
  }
  return (
    <div className={props.divClass}>
      <div className="p-1 border radius-10 crop">
        <input name={props.name} type="hidden" defaultValue={value} />
        <img src={avatar} alt="img" className="wpx-85 radius-5 opacity-1" />
        <div className="d-flex align-items-center mt-1">
          <label className="col alert alert-light py-1 pointer">
            <span className="title"> Unggah </span>
            <input type="file" className="d-none" accept=".png,.jpg,.jpeg" onChange={(e) => change(e)} />
          </label>
          <div className="col alert ml-1 alert-success py-1 pointer jadikan d-none" onClick={(e) => getImg(e)}>
            Jadikan
          </div>
          <div className="col alert ml-1 alert-danger py-1 pointer remove d-none" onClick={(e) => removeImg(e)}>
            Hapus
          </div>
        </div>
      </div>
    </div>
  )
}
class Siswa extends React.Component {
  constructor(){
    super();
    this._isMounted = false;
    this.state = {
      avatar:con.img+'/user-add.png',
      nis:'',
      statusWali:[{id:'Ayah',text:'Ayah'},{id:'Ibu',text:'Ibu'},{id:'Saudara/i',text:'Saudara/i'}],
      notifBg:'success',
      notifMsg:''
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Tambah Siswa';
    this._isMounted && axios.get(con.api+'/siswa/nis', {headers:con.headers}).then(res => {
      this.setState({
        nis:res.data
      });
    });
  }
  submit(){
    let q = {};
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
    q['kelas_id'] = this.form.querySelector('select[name="kelas_id"]').value;
    q['status'] = this.form.querySelector('input[name="status"]:checked').value;
    let catatanCount = this.catatan.editor.value.replace(/<\/?[^>]+>/ig, "").length;
    if (catatanCount) q['catatan'] = this.catatan.editor.value;
    let isEmailValid = this.form.querySelector('input[name="wali_email"]').getAttribute('data-valid') === 'true';
    let allFilled = Object.values(q).every((i) => i !== "");
    if (allFilled && isEmailValid) {
      axios.post(con.api+'/siswa/store', q, {headers:con.headers})
      .then(res => {
        this.setState({ notifBg:'success', notifMsg:'Data Siswa berhasil disimpan' }, () => document.querySelector('.notif-show').click());
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
                  <p className="text-capitalize m-0 lh-1 f-9 bolder text-primary mr-2">TAMBAH SISWA</p>
                </div>
              </div>
              <div className="card-body py-2" ref={i => this.form = i}>
                <div className="row mb-2 align-items-end">
                  <Image divClass="col-auto text-center" name="avatar" />
                  <div className="col">
                    <div className="row">
                      <Input name="nis" title="Nomor Identitas Siswa" divClass="col" note="*NIS dibuat otomatis oleh sistem" value={this.state.nis} readOnly />
                      <Input name="nama" title="Nama Siswa" divClass="col" error="*Nama Siswa harus di isi" placeholder="Isi dengan nama lengkap" capital />
                    </div>
                    <div className="row">
                      <Mask name="kk" divClass="col" placeholder="Isi dengan angka" error="*Kartu Keluarga harus diisi" title="Kartu Keluarga" />
                      <Lahir />
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <Autocomplete divClass="col" title="Alamat" api="lokasi" name="alamat" placeholder="Cari alamat" error="*Alamat harus di isi" />
                  <div className="col-auto pt-2">
                    <Radio name="gender" setOption={{1:'Laki-laki', 0:'Perempuan'}} checked={1} />
                  </div>
                </div>
                <div className="row align-items-center py-3">
                  <div className="col px-0"><hr className="m-0" /></div>
                  <div className="col-auto"><span className="alert alert-info py-1 bolder">Informasi Wali</span></div>
                  <div className="col px-0"><hr className="m-0" /></div>
                </div>
                <div className="row mb-2">
                  <Select name="wali_status" title="Status Wali" className="col" data={this.state.statusWali} placeholder="Pilih Status Wali" />
                  <Input name="wali_nama" title="Nama Wali" divClass="col" error="*Nama Wali harus di isi" placeholder="Isi dengan nama lengkap" capital />
                </div>
                <div className="row mb-2">
                  <Mask name="wali_tlp" title="Telp. Wali" error="*Telp. Wali harus di isi" mask="999999999999" divClass="col" placeholder="Isi dengan angka" />
                  <Email name="wali_email" divClass="col" title="Email Wali" placeholder="Email" />
                </div>
                <div className="row align-items-center py-3">
                  <div className="col px-0"><hr className="m-0" /></div>
                  <div className="col-auto"><span className="alert alert-info py-1 bolder">Lainnya</span></div>
                  <div className="col px-0"><hr className="m-0" /></div>
                </div>
                <div className="row mb-2">
                  <Editor optMin ref={i => this.catatan = i} title="Catatan Siswa" divClass="col" placeholder="Catatan siswa seperti prestasi, bakat, hobi, atau kelebihan dan kekurangan siswa" />
                </div>
                <div className="row align-items-center py-3">
                  <div className="col px-0"><hr className="m-0" /></div>
                  <div className="col-auto"><span className="alert alert-info py-1 bolder">Status Siswa</span></div>
                  <div className="col px-0"><hr className="m-0" /></div>
                </div>
                <div className="row mb-2">
                  <Select name="kelas_id" title="Kelas" className="col-md-4 offset-md-4 text-center" error="*Kelas harus di isi" url='kelas/select' placeholder="Pilih Kelas" />
                </div>
                <div className="row mb-2">
                  <div className="col text-center pt-2">
                    <Radio name="status" setOption={{0:'Siswa Nonaktif', 1:'Siswa Aktif', 2:'Lulus', 3:'Daftar', 4:'Pindahan'}} checked={3} divClass="justify-content-center" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed-bottom p-3 bg-white z-99 shadow-lg border-top">
          <div className="text-right">
            <span onClick={this.props.history.goBack} className="alert alert-light py-2 mr-2 pointer">KEMBALI</span>
            <span className="alert alert-success py-2 px-4 pointer" onClick={this.submit.bind(this)}>PROSES</span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Siswa
