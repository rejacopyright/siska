import React from 'react';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import con from '../api/connection';
import { Scrollbars } from 'react-custom-scrollbars';
import Input from '../misc/input';
import Select from '../misc/select';
import InputMask from 'react-input-mask';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import Radio from '../misc/radio';
import Modal from '../misc/modal';
import Autocomplete from '../misc/autocomplete';
import Email from '../misc/email';
import Username from '../misc/username';
import Password from '../misc/password';
import moment from 'moment';
import 'moment/locale/id';
import DatePicker from 'react-date-picker';
import Random from 'randomstring';
import Notif from '../misc/notif';

class User extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      user:[],
      user_page:1,
      user_search:'',
      user_self:{jabatan:{}},
      loading:true,
      avatar:'user.png',
      base64:'',
      notifBg:'success',
      notifMsg:''
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'User';
    this._isMounted && axios.get(con.api+'/sdm/user', {headers:con.headers, params:{page:this.state.user_page}})
    .then(res => {
      this.setState({ user:res.data.user, loading:false });
    });
    }
  componentWillUnmount() {
    this._isMounted = false;
  }
  add = (e) => {
    e.preventDefault();
    const q = {};
    q['nama'] = this.addForm.querySelector('input[name="nama"]').value;
    q['gender'] = this.addForm.querySelector('input[name="gender"]:checked').value;
    q['jabatan_id'] = this.addForm.querySelector('select[name="jabatan_id"]').value;
    q['nip'] = this.addForm.querySelector('input[name="nip"]').value;
    q['nik'] = this.addForm.querySelector('input[name="nik"]').value;
    q['kk'] = this.addForm.querySelector('input[name="kk"]').value;
    q['alamat'] = this.addForm.querySelector('input[name="alamat"]').value;
    q['lahir'] = this.addForm.querySelector('input[name="lahir"]').value;
    q['tlp'] = this.addForm.querySelector('input[name="tlp"]').value;
    q['wa'] = this.addForm.querySelector('input[name="wa"]').value;
    q['email'] = this.addForm.querySelector('input[name="email"]').value;
    q['rek_bank'] = this.addForm.querySelector('input[name="rek_bank"]').value;
    q['rek_no'] = this.addForm.querySelector('input[name="rek_no"]').value;
    q['rek_nama'] = this.addForm.querySelector('input[name="rek_nama"]').value;
    q['tgl_daftar'] = this.addForm.querySelector('input[name="tgl_daftar"]').value;
    q['expired'] = this.addForm.querySelector('input[name="expired"]').value;
    q['username'] = this.addForm.querySelector('input[name="username"]').value;
    q['password'] = this.addForm.querySelector('input[name="password"]').value;
    q['password_konfirmasi'] = this.addForm.querySelector('input[name="password_konfirmasi"]').value;
    // Validity
    let isEmailValid = this.addForm.querySelector('input[name="email"]').getAttribute('data-valid') === 'true';
    let isUsernameExist = this.addForm.querySelector('input[name="username"]').getAttribute('data-exist') === 'true';
    let isPasswordValid = this.addForm.querySelector('input[name="password"]').getAttribute('data-accept') === 'true';
    let isPasswordKonfirmasiValid = this.addForm.querySelector('input[name="password_konfirmasi"]').getAttribute('data-accept') === 'true';
    let isPasswordMatchandValid = isPasswordValid && isPasswordKonfirmasiValid && q.password === q.password_konfirmasi;
    if (!isPasswordMatchandValid) {
      this.addForm.querySelector('input[name="password_konfirmasi"]').classList.add('border-danger');
    }else {
      this.addForm.querySelector('input[name="password_konfirmasi"]').classList.remove('border-danger');
    }
    let isValid = q.nama && q.jabatan_id && isEmailValid && !isUsernameExist && isPasswordMatchandValid;
    if (isValid) {
      axios.post(con.api+'/sdm/user/store', q, {headers:con.headers}).then(res => {
        this.setState({ user:res.data.user, user_page:1, notifBg:'success', notifMsg:'Data User berhasil ditambahkan' }, () => {
          document.querySelector('.notif-show').click();
          document.getElementById('table-user').parentElement.scrollTo(0,0);
        });
      });
    }else {
      this.setState({ notifBg:'danger', notifMsg:'Mohon periksa kembali kelengkapan data yang harus di isi' }, () => document.querySelector('.notif-show').click());
    }
  }
  edit = (e) => {
    e.preventDefault();
    const q = {admin_id:this.state.user_self.admin_id};
    q['nama'] = this.editForm.querySelector('input[name="nama"]').value;
    q['gender'] = this.editForm.querySelector('input[name="gender"]:checked').value;
    q['jabatan_id'] = this.editForm.querySelector('select[name="jabatan_id"]').value;
    q['nip'] = this.editForm.querySelector('input[name="nip"]').value;
    q['nik'] = this.editForm.querySelector('input[name="nik"]').value;
    q['kk'] = this.editForm.querySelector('input[name="kk"]').value;
    q['alamat'] = this.editForm.querySelector('input[name="alamat"]').value;
    q['lahir'] = this.editForm.querySelector('input[name="lahir"]').value;
    q['tlp'] = this.editForm.querySelector('input[name="tlp"]').value;
    q['wa'] = this.editForm.querySelector('input[name="wa"]').value;
    q['email'] = this.editForm.querySelector('input[name="email"]').value;
    q['rek_bank'] = this.editForm.querySelector('input[name="rek_bank"]').value;
    q['rek_no'] = this.editForm.querySelector('input[name="rek_no"]').value;
    q['rek_nama'] = this.editForm.querySelector('input[name="rek_nama"]').value;
    q['tgl_daftar'] = this.editForm.querySelector('input[name="tgl_daftar"]').value;
    q['expired'] = this.editForm.querySelector('input[name="expired"]').value;
    q['username'] = this.editForm.querySelector('input[name="username"]').value;
    q['password'] = this.editForm.querySelector('input[name="password"]').value;
    q['password_konfirmasi'] = this.editForm.querySelector('input[name="password_konfirmasi"]').value;
    // Validity
    let isEmailValid = this.editForm.querySelector('input[name="email"]').getAttribute('data-valid') !== 'false';
    let isUsernameExist = this.editForm.querySelector('input[name="username"]').getAttribute('data-exist') === 'true';
    let isPasswordValid = this.editForm.querySelector('input[name="password"]').getAttribute('data-accept') !== 'false';
    let isPasswordKonfirmasiValid = this.editForm.querySelector('input[name="password_konfirmasi"]').getAttribute('data-accept') === 'true';
    let isPasswordMatchandValid = isPasswordValid && isPasswordKonfirmasiValid && q.password === q.password_konfirmasi;
    if (isPasswordMatchandValid || !this.editForm.querySelector('input[name="password"]').value) {
      this.editForm.querySelector('input[name="password_konfirmasi"]').classList.remove('border-danger');
    }else {
      this.editForm.querySelector('input[name="password_konfirmasi"]').classList.add('border-danger');
    }
    let isValid = q.nama && q.jabatan_id && isEmailValid && !isUsernameExist && (isPasswordMatchandValid || !this.editForm.querySelector('input[name="password"]').value);
    if (isValid) {
      axios.post(con.api+'/sdm/user/update', q, {headers:con.headers}).then(res => {
        this.setState({ user:res.data.user, user_page:1, notifBg:'success', notifMsg:'Data User berhasil diupdate' }, () => {
          document.querySelector('.notif-show').click();
          document.getElementById('table-user').parentElement.scrollTo(0,0);
        });
      });
    }else {
      this.setState({ notifBg:'danger', notifMsg:'Mohon periksa kembali kelengkapan data yang harus di isi' }, () => document.querySelector('.notif-show').click());
    }
  }
  delete(e){
    let q = {user_id: this.state.user_self.user_id};
    axios.post(con.api+'/sdm/user/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ user:res.data.user });
      document.getElementById('table-user').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/sdm/user', {headers:con.headers, params:{page:this.state.user_page + 1, q:this.state.user_search}})
      .then(res => {
        if (res.data.user.length) {
          this.setState({ user:this.state.user.concat(res.data.user), user_page:this.state.user_page + 1, loading:false });
        }
      });
    }
  }
  searcUser(e){
    axios.get(con.api+'/sdm/user', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ user:res.data.user, user_page:1, user_search:res.config.params.q });
    });
  }
  handleAddImg(e){
    if (e.target.files.length) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.setState({ avatar: reader.result }, () => {
          new Cropper(this.img, {
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
            crop(e) {
              // console.log(e.detail.x); // console.log(e.detail.y); // console.log(e.detail.width); // console.log(e.detail.height); // console.log(e.detail.rotate); // console.log(e.detail.scaleX); // console.log(e.detail.scaleY);
            },
            ready() {
              this.cropper.move(-15, -1);
            },
          });
        });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  setImg(){
    let q = {};
    if (this.img.cropper) {
      q['avatar'] = this.img.cropper.getCroppedCanvas().toDataURL();
      q['admin_id'] = this.state.user_self.admin_id;
      axios.post(con.api+'/sdm/user/update_img', q, {headers:con.headers})
      .then(res => {
        this.setState({ user:res.data.user, user_page:1 });
        document.getElementById('table-user').parentElement.scrollTo(0,0);
      });
    }
  }
  render() {
    const ModalAdd = () => {
      const [dateValue, setDateValue] = React.useState(new Date());
      const [register, setRegister] = React.useState(moment().toDate());
      const [expired, setExpired] = React.useState(moment().add(1, 'y').toDate());
      return (
        <form ref={i => this.addForm = i} onSubmit={this.add.bind(this)}>
          {/* ROW 1 */}
          <div className="row mb-2 align-items-center">
            <Input name="nama" title="Nama Lengkap" divClass="col" error="*Nama lengkap harus di isi" className="text-capitalize" placeholder="Nama Lengkap" />
            <Radio name="gender" setOption={{1:'Laki-laki', 0:'Perempuan'}} checked={1} />
            <Select name="jabatan_id" title="Jabatan" className="col" error="*Jabatan harus di isi" ref={i => this.sel = i} url='sdm/jabatan/select' placeholder="Pilih Jabatan" />
          </div>
          {/* MASA JABATAN */}
          <div className="row">
            <div className="col-md mb-2">
              <small className="text-nowrap">Tgl Daftar</small>
              <DatePicker name="tgl_daftar" onChange={(i) => this._isMounted && setRegister(i)} value={register} format="dd-MM-yyyy" className="bg-light d-block" calendarClassName="border-0 radius-10 shadow p-2" locale="id" clearIcon={null} calendarIcon={<i className="la la-calendar-alt text-primary la-2x"></i>} />
            </div>
            <div className="col-md mb-2">
              <small className="text-nowrap">Tgl Habis Jabatan</small>
              <DatePicker name="expired" onChange={(i) => this._isMounted && setExpired(i)} value={expired} format="dd-MM-yyyy" className="bg-light d-block" calendarClassName="border-0 radius-10 shadow p-2" locale="id" clearIcon={null} calendarIcon={<i className="la la-calendar-alt text-primary la-2x"></i>} />
            </div>
          </div>
          {/* ROW 2 */}
          <div className="row mb-2 align-items-center">
            <div className="col">
              <small className="text-nowrap">NIP</small>
              <InputMask mask="99999999999999999999" maskChar={null} type="text" name="nip" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
            <div className="col">
              <small className="text-nowrap">NIK</small>
              <InputMask mask="99999999999999999999" maskChar={null} type="text" name="nik" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
            <div className="col">
              <small className="text-nowrap">KK</small>
              <InputMask mask="99999999999999999999" maskChar={null} type="text" name="kk" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
          </div>
          {/* ROW 3 */}
          <div className="row mb-2 align-items-center">
            <Autocomplete divClass="col-md-9" title="Alamat" api="lokasi" name="alamat" placeholder="Cari alamat" />
            <div className="col-md-3">
              <small className="text-nowrap">Tgl Lahir</small>
              <DatePicker name="lahir" onChange={(i) => this._isMounted && setDateValue(i)} value={dateValue} format="dd-MM-yyyy" className="bg-light d-block" calendarClassName="border-0 radius-10 shadow p-2" locale="id" clearIcon={null} calendarIcon={<i className="la la-calendar-alt text-primary la-2x"></i>} />
            </div>
          </div>
          {/* ROW 4 */}
          <div className="row mb-2 align-items-center">
            <div className="col">
              <small className="text-nowrap">Telp</small>
              <InputMask mask="999999999999" maskChar={null} type="text" name="tlp" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
            <div className="col">
              <small className="text-nowrap">Whatsapp</small>
              <InputMask mask="999999999999" maskChar={null} type="text" name="wa" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
            <Email name="email" divClass="col" title="Email" placeholder="Email" />
          </div>
          {/* ROW 5 */}
          <div className="row mb-3 align-items-center">
            <div className="col">
              <small className="text-nowrap">No. Rekening</small>
              <InputMask mask="999999999999" maskChar={null} type="text" name="rek_no" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
            <Input name="rek_bank" title="Nama Bank" divClass="col" className="text-capitalize" placeholder="Contoh: BCA" />
            <Input name="rek_nama" title="Atas Nama" divClass="col" className="text-capitalize" placeholder="Contoh: REJA JAMIL" />
          </div>
          {/* USERNAME PASSWORD */}
          <div className="row my-2 align-items-center bg-light text-dark py-2 px-3 border-top border-bottom">
            <p className="m-0 lh-1 bolder">Informasi Akun</p>
          </div>
          {/* ROW 6 */}
          <div className="row mb-2 align-items-center">
            <Username name="username" ref={i => this.username = i} title="Username" error="*Username wajib di isi" divClass="col" placeholder="Username" />
            <Password name="password" error="Password harus di isi" length="6" capital={false} number={false} divClass="col" title="Password" placeholder="Minimal 6 karakter" />
            <Password name="password_konfirmasi" length="6" capital={false} number={false} divClass="col" title="Konfirmasi Password" placeholder="Konfirmasi Password" />
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button type="button" className="btn btn-sm btn-success radius-5 px-4" data-dismiss="modal" onClick={this.add.bind(this)}> Proses </button>
            </div>
          </div>
        </form>
      )
    }
    const ModalEdit = () => {
      const [dateValue, setDateValue] = React.useState(new Date(this.state.user_self.lahir ? this.state.user_self.lahir.split(' ').join('T') : true));
      const [register, setRegister] = React.useState(moment(this.state.user_self.tgl_daftar).toDate());
      const [expired, setExpired] = React.useState(moment(this.state.user_self.expired).toDate());
      return (
        <form ref={i => this.editForm = i} onSubmit={this.edit.bind(this)}>
          {/* ROW 1 */}
          <div className="row mb-2 align-items-center">
            <Input name="nama" value={this.state.user_self.nama || ''} title="Nama Lengkap" divClass="col" error="*Nama lengkap harus di isi" className="text-capitalize" placeholder="Nama Lengkap" />
            <Radio name="gender" setOption={{1:'Laki-laki', 0:'Perempuan'}} checked={this.state.user_self.gender} />
            <Select name="jabatan_id" title="Jabatan" className="col" error="*Jabatan harus di isi" ref={i => this.sel = i} url='sdm/jabatan/select' placeholder="Pilih Jabatan" selected={this.state.user_self.jabatan ? [this.state.user_self.jabatan.jabatan_id, this.state.user_self.jabatan.nama] : false} />
          </div>
          {/* MASA JABATAN */}
          <div className="row">
            <div className="col-md mb-2">
              <small className="text-nowrap">Tgl Daftar</small>
              <DatePicker name="tgl_daftar" onChange={(i) => setRegister(i)} value={register} format="dd-MM-yyyy" className="bg-light d-block" calendarClassName="border-0 radius-10 shadow p-2" locale="id" clearIcon={null} calendarIcon={<i className="la la-calendar-alt text-primary la-2x"></i>} />
            </div>
            <div className="col-md mb-2">
              <small className="text-nowrap">Tgl Habis Jabatan</small>
              <DatePicker name="expired" onChange={(i) => setExpired(i)} value={expired} format="dd-MM-yyyy" className="bg-light d-block" calendarClassName="border-0 radius-10 shadow p-2" locale="id" clearIcon={null} calendarIcon={<i className="la la-calendar-alt text-primary la-2x"></i>} />
            </div>
          </div>
          {/* ROW 2 */}
          <div className="row mb-2 align-items-center">
            <div className="col">
              <small className="text-nowrap">NIP</small>
              <InputMask defaultValue={this.state.user_self.nip || ''} mask="99999999999999999999" maskChar={null} type="text" name="nip" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
            <div className="col">
              <small className="text-nowrap">NIK</small>
              <InputMask defaultValue={this.state.user_self.nik || ''} mask="99999999999999999999" maskChar={null} type="text" name="nik" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
            <div className="col">
              <small className="text-nowrap">KK</small>
              <InputMask defaultValue={this.state.user_self.kk || ''} mask="99999999999999999999" maskChar={null} type="text" name="kk" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
          </div>
          {/* ROW 3 */}
          <div className="row mb-2 align-items-center">
            <Autocomplete divClass="col-md-9" title="Alamat" api="lokasi" name="alamat" placeholder="Cari alamat" value={this.state.user_self.alamat || ''} />
            <div className="col-md-3">
              <small className="text-nowrap">Tgl Lahir</small>
              <DatePicker name="lahir" onChange={(i) => setDateValue(i)} value={dateValue} format="dd-MM-yyyy" className="bg-light d-block" calendarClassName="border-0 radius-10 shadow p-2" locale="id" clearIcon={null} calendarIcon={<i className="la la-calendar-alt text-primary la-2x"></i>} />
            </div>
          </div>
          {/* ROW 4 */}
          <div className="row mb-2 align-items-center">
            <div className="col">
              <small className="text-nowrap">Telp</small>
              <InputMask defaultValue={this.state.user_self.tlp || ''} mask="999999999999" maskChar={null} type="text" name="tlp" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
            <div className="col">
              <small className="text-nowrap">Whatsapp</small>
              <InputMask defaultValue={this.state.user_self.wa || ''} mask="999999999999" maskChar={null} type="text" name="wa" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
            <Email name="email" value={this.state.user_self.email || ''} divClass="col" title="Email" placeholder="Email" />
          </div>
          {/* ROW 5 */}
          <div className="row mb-3 align-items-center">
            <div className="col">
              <small className="text-nowrap">No. Rekening</small>
              <InputMask defaultValue={this.state.user_self.rek_no || ''} mask="999999999999" maskChar={null} type="text" name="rek_no" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
            <Input value={this.state.user_self.rek_bank || ''} name="rek_bank" title="Nama Bank" divClass="col" className="text-capitalize" placeholder="Contoh: BCA" />
            <Input value={this.state.user_self.rek_nama || ''} name="rek_nama" title="Atas Nama" divClass="col" className="text-capitalize" placeholder="Contoh: REJA JAMIL" />
          </div>
          {/* USERNAME PASSWORD */}
          <div className="row my-2 align-items-center bg-light text-dark py-2 px-3 border-top border-bottom">
            <p className="m-0 lh-1 bolder">Informasi Akun</p>
          </div>
          {/* ROW 6 */}
          <div className="row mb-2 align-items-center">
            <Username value={this.state.user_self.username || ''} name="username" ref={i => this.username = i} title="Username" error="*Username wajib di isi" divClass="col" placeholder="Username" />
            <Password name="password" error="Password harus di isi" length="6" capital={false} number={false} divClass="col" title="Ganti Password" placeholder="Ganti Password" />
            <Password name="password_konfirmasi" length="6" capital={false} number={false} divClass="col" title="Konfirmasi Password" placeholder="Konfirmasi Password" />
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button type="button" className="btn btn-sm btn-success radius-5 px-4" data-dismiss="modal" onClick={this.edit.bind(this)}> Update </button>
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
              <p className="m-0 lh-15 alert alert-warning">
                Menghapus user menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus user <span className="text-danger strong h5">{this.state.user_self.username || ''}</span> ?
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
          <div className="row pt-2">
            <div className="col p-0 text-center">
              <img src={this.state.avatar} ref={i => this.img = i} alt="img" className={this.state.user_self.avatar ? 'w-100' : 'p-5 '} />
            </div>
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-center">
              <input type="file" ref={i => this.gantiFoto = i} onChange={this.handleAddImg.bind(this)} accept=".png,.jpg,.jpeg" style={{display:'none'}} />
              <button className="alert alert-warning py-1 px-3 pointer mr-2" onClick={() => this.gantiFoto.click()} > Ganti Foto </button>
              <button className="alert alert-success py-1 px-4 pointer" onClick={this.setImg.bind(this)} data-dismiss="modal"> Update </button>
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
          <Notif close duration="5000" bg={this.state.notifBg} v="bottom" h="center" message={this.state.notifMsg} />
          <div className="card no-b shadow-lg radius-10 px-2">
            <div className="card-header bg-white b-0 px-3 py-2">
              <div className="row align-items-center">
                <div className="col px-0">
                  <div className="form-group has-icon m-0">
                    <i className="la la-search" />
                    <input onChange={this.searcUser.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Pencarian" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto pr-0 text-right">
                  <span className="alert alert-info py-1 px-2 pointer f-9 bolder" data-toggle="modal" data-target="#tambah-usr-mdl" onClick={() => setTimeout(() => this.addForm.querySelector('input[name="nama"]').focus(), 100)}><i className="la la-user mr-1"></i>Tambah User</span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover mb-0" id="table-user">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs text-center">#</th>
                        <th className="sticky bg-white shadow-xs">Nama</th>
                        <th className="sticky bg-white shadow-xs">Jabatan</th>
                        <th className="sticky bg-white shadow-xs">Usia</th>
                        <th className="sticky bg-white shadow-xs">Whatsapp</th>
                        <th className="sticky bg-white shadow-xs">Email</th>
                        <th className="sticky bg-white shadow-xs">Masa Jabatan</th>
                        <th className="sticky bg-white shadow-xs text-right">-</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.user.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center bold">{index+1}.</td>
                              <td className="text-center">
                                <div className="pointer user_avatar_xxs oh" data-toggle="modal" data-target="#add-img-mdl" onClick={() => this.setState({user_self:r})}>
                                  {
                                    r.avatar ?
                                    <img className="radius-20 w-100" src={con.img+'/user/thumb/'+r.avatar+'?'+Random.generate()} alt="img" onClick={() => this.setState({avatar:con.img + '/user/' + r.avatar +'?'+Random.generate()})} /> :
                                    <i className="la la-user la-lg" onClick={() => this.setState({avatar:con.img + '/user.png'})} />
                                  }
                                </div>
                              </td>
                              <td className="bold text-nowrap">{r.nama}</td>
                              <td className="text-nowrap">
                                {
                                  r.jabatan ?
                                  <span className="alert alert-info bold py-0 f-8 px-2">{r.jabatan.nama}</span> :
                                  <i className="la la-times-circle text-danger" />
                                }
                              </td>
                              <td className="f-8 bolder text-nowrap">{moment().diff(r.lahir, 'years')} Tahun</td>
                              <td className="text-nowrap">{r.wa || <i className="la la-times-circle text-danger" />}</td>
                              <td className="bold f-8 text-nowrap">{r.email}</td>
                              <td className="bold f-8 text-nowrap">{ moment(r.expired).isAfter() ? moment(r.expired).fromNow(true) + ' Lagi' : <span className="badge badge-danger-light border border-danger f-8 bolder py-1 px-2 badge-pill">Habis</span> }</td>
                              <td className="text-right text-nowrap">
                                <span className="btn-fab btn-fab-xs btn-warning-light border border-warning mr-2" data-toggle="modal" data-target="#edit-usr-mdl" onClick={() => this.setState({user_self:r}, () => setTimeout(() => this.editForm.querySelector('input[name="nama"]').focus(), 100))}><i className="la la-pen"></i></span>
                                <span className="btn-fab btn-fab-xs btn-danger-light border border-danger" data-toggle="modal" data-target="#delete-usr-mdl" onClick={() => this.setState({user_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='tambah-usr-mdl' size='lg' title='Tambah User' body={<ModalAdd />} />
          <Modal id='edit-usr-mdl' size='lg' title='Edit User' body={<ModalEdit />} />
          <Modal id='delete-usr-mdl' size='md' title='Hapus User' body={<ModalDelete />} />
          <Modal id='add-img-mdl' size='sm' title='Foto Profil' body={<ModalAddImg />} bodyClass="pt-0" />
        </div>
      </div>
    );
  }
}
export default User
