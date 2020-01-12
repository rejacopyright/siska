import React from 'react';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import con from '../api/connection';
import { Scrollbars } from 'react-custom-scrollbars';
import Input from '../misc/input';
import InputMask from 'react-input-mask';
import Select from '../misc/select';
import Text from '../misc/text';
import Modal from '../misc/modal';
import Pop from '../misc/popover';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import Random from 'randomstring';

function Status(props){
  switch (props.value) {
    case 0:
      return <span className="badge badge-light border border-gray f-8 bolder py-1 px-2 badge-pill">Diarsipkan</span>;
    case 1:
      return <span className="badge badge-success-light border border-success f-8 bolder py-1 px-2 badge-pill">Tersedia</span>;
    case 2:
      return <span className="badge badge-warning-light border border-warning f-8 bolder py-1 px-2 badge-pill">Dipesan</span>;
    case 3:
      return <span className="badge badge-light border border-gray f-8 bolder py-1 px-2 badge-pill">Dipinjam</span>;
    case 4:
      return <span className="badge badge-info-light border border-info f-8 bolder py-1 px-2 badge-pill">Dikembalikan</span>;
    case 5:
      return <span className="badge badge-danger-light border border-danger f-8 bolder py-1 px-2 badge-pill">Hilang</span>;
    default:
    return <i className="la la-times-circle text-danger" />;
  }
}
class Perpustakaan extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      perpustakaan:{kategori:{},koleksi:{},penerbit:{}},
      perpustakaan_page:1,
      perpustakaan_search:'',
      perpustakaan_self:{kategori:{},koleksi:{},penerbit:{}},
      loading:true,
      cover:'book.png',
      base64:'',
      bahasa:[{id:'Indonesia',text:'Indonesia'},{id:'Inggris',text:'Inggris'},{id:'Arab',text:'Arab'},{id:'Jepang',text:'Jepang'},{id:'China',text:'China'},{id:'Prancis',text:'Prancis'},{id:'Jerman',text:'Jerman'},{id:'Spanyol',text:'Spanyol'}]
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Perpustakaan';
    this._isMounted && axios.get(con.api+'/perpustakaan', {headers:con.headers, params:{page:this.state.perpustakaan_page}})
    .then(res => {
      this.setState({ perpustakaan:res.data.perpustakaan, loading:false });
    });
    }
  componentWillUnmount() {
    this._isMounted = false;
  }
  add(e){
    e.preventDefault();
    const q = {};
    q['judul'] = this.addForm.querySelector('input[name="judul"]').value;
    q['bahasa'] = this.addForm.querySelector('select[name="bahasa"]').value;
    q['kategori_id'] = this.addForm.querySelector('select[name="kategori_id"]').value;
    q['koleksi_id'] = this.addForm.querySelector('select[name="koleksi_id"]').value;
    q['pengarang'] = this.addForm.querySelector('input[name="pengarang"]').value;
    q['penerbit_id'] = this.addForm.querySelector('select[name="penerbit_id"]').value;
    q['tahun'] = this.addForm.querySelector('input[name="tahun"]').value;
    q['sumber'] = this.addForm.querySelector('input[name="sumber"]').value;
    q['stok'] = this.addForm.querySelector('input[name="stok"]').value;
    q['keterangan'] = this.addForm.querySelector('textarea[name="keterangan"]').value;
    if (q.judul && q.kategori_id && q.koleksi_id && q.pengarang && q.penerbit_id && q.tahun && q.stok) {
      axios.post(con.api+'/perpustakaan/store', q, {headers:con.headers}).then(res => {
        this.setState({ perpustakaan:res.data.perpustakaan, perpustakaan_page:1 });
      });
    }
  }
  edit(e){
    e.preventDefault();
    const q = {perpustakaan_id:this.state.perpustakaan_self.perpustakaan_id};
    q['judul'] = this.editForm.querySelector('input[name="judul"]').value;
    q['bahasa'] = this.editForm.querySelector('select[name="bahasa"]').value;
    q['kategori_id'] = this.editForm.querySelector('select[name="kategori_id"]').value;
    q['koleksi_id'] = this.editForm.querySelector('select[name="koleksi_id"]').value;
    q['pengarang'] = this.editForm.querySelector('input[name="pengarang"]').value;
    q['penerbit_id'] = this.editForm.querySelector('select[name="penerbit_id"]').value;
    q['tahun'] = this.editForm.querySelector('input[name="tahun"]').value;
    q['sumber'] = this.editForm.querySelector('input[name="sumber"]').value;
    q['stok'] = this.editForm.querySelector('input[name="stok"]').value;
    q['keterangan'] = this.editForm.querySelector('textarea[name="keterangan"]').value;
    if (q.judul && q.kategori_id && q.koleksi_id && q.pengarang && q.penerbit_id && q.tahun && q.stok) {
      axios.post(con.api+'/perpustakaan/update', q, {headers:con.headers}).then(res => {
        this.setState({ perpustakaan:res.data.perpustakaan, perpustakaan_page:1 }, () => this.search.click());
      });
    }
  }
  delete(e){
    let q = {perpustakaan_id: this.state.perpustakaan_self.perpustakaan_id};
    axios.post(con.api+'/perpustakaan/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ perpustakaan:res.data.perpustakaan });
      document.getElementById('table-perpustakaan').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/perpustakaan', {headers:con.headers, params:{page:this.state.perpustakaan_page + 1, q:this.state.perpustakaan_search}})
      .then(res => {
        if (res.data.perpustakaan.length) {
          this.setState({ perpustakaan:this.state.perpustakaan.concat(res.data.perpustakaan), perpustakaan_page:this.state.perpustakaan_page + 1, loading:false });
        }
      });
    }
  }
  searcPerpustakaan(e){
    axios.get(con.api+'/perpustakaan', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ perpustakaan:res.data.perpustakaan, perpustakaan_page:1, perpustakaan_search:res.config.params.q });
    });
  }
  handleAddImg(e){
    if (e.target.files.length) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.setState({ cover: reader.result }, () => {
          new Cropper(this.img, {
            // aspectRatio: 1 / 1,
            guides: false,
            strict: false,
            highlight: false,
            dragCrop: false,
            movable: false,
            resizable: false,
            rotatable: false,
            cropBoxResizable: false,
            scalable: false,
            viewMode: 1,
            center: true,
            dragMode: 'move',
            background: false,
            modal: false,
            zoomOnWheel: false,
            toggleDragModeOnDblclick: false,
            wheelZoomRatio: 1,
            autoCropArea: 1,
            crop(e) {
              // console.log(e.detail.x); // console.log(e.detail.y); // console.log(e.detail.width); // console.log(e.detail.height); // console.log(e.detail.rotate); // console.log(e.detail.scaleX); // console.log(e.detail.scaleY);
            },
            ready() {
              // this.cropper.move(-15, -1);
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
      q['img'] = this.img.cropper.getCroppedCanvas().toDataURL();
      q['perpustakaan_id'] = this.state.perpustakaan_self.perpustakaan_id;
      axios.post(con.api+'/perpustakaan/update_img', q, {headers:con.headers})
      .then(res => {
        this.setState({ perpustakaan:res.data.perpustakaan, perpustakaan_page:1 });
      });
    }
  }
  render() {
    const ModalAdd = () => {
      return (
        <div ref={i => this.addForm = i}>
          <div className="row">
            <Input name="judul" divClass="col-md-7 mb-2" title="Judul Buku" capital error="*Judul Buku harus di isi" placeholder="Judul Buku" />
            <Select name="bahasa" title="Bahasa" className="col-md-5 mb-2" data={this.state.bahasa} placeholder="Pilih Bahasa Buku" />
          </div>
          <div className="row">
            <Select name="kategori_id" title="Kategori" className="col mb-2" error="*Kategori harus di isi" url='perpustakaan/kategori/select' placeholder="Pilih Kategori" />
            <Select name="koleksi_id" title="Koleksi" className="col mb-2" error="*Koleksi harus di isi" url='perpustakaan/koleksi/select' placeholder="Pilih Koleksi" />
          </div>
          <div className="row">
            <Input name="pengarang" divClass="col-md-5 mb-2" title="Nama Pengarang Buku" capital error="*Nama Pengarang harus di isi" placeholder="Nama Pengarang" />
            <Select name="penerbit_id" title="Penerbit" className="col-md-5 mb-2" error="*Penerbit harus di isi" url='perpustakaan/penerbit/select' placeholder="Pilih Penerbit" />
            <div className="col-md-2 mb-2">
              <small className="text-nowrap">Tahun Terbit</small>
              <InputMask mask="9999" defaultValue={new Date().getFullYear()} maskChar={null} type="text" name="tahun" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan tahun" />
            </div>
          </div>
          <div className="row">
            <Input name="sumber" divClass="col-md-9 mb-2" title="Sumber Buku" placeholder="Opsional (Contoh: Inventaris / Donasi Siswa / Dll)" />
            <div className="col-md-3 mb-2">
              <small className="text-nowrap">Stok</small>
              <InputMask mask="99999" maskChar={null} type="text" name="stok" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
          </div>
          <Text name="keterangan" divClass="w-100 mb-2" title="Keterangan" placeholder="Keterangan Opsional (Tulis jika membutuhkan keterangan)" rows="5" />
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
            <Input name="judul" value={this.state.perpustakaan_self.judul} divClass="col-md-7 mb-2" title="Judul Buku" capital error="*Judul Buku harus di isi" placeholder="Judul Buku" />
            <Select name="bahasa" title="Bahasa" className="col-md-5 mb-2" data={this.state.bahasa} placeholder="Pilih Bahasa Buku" selected={[this.state.perpustakaan_self.bahasa, this.state.perpustakaan_self.bahasa]} />
          </div>
          <div className="row">
            <Select name="kategori_id" title="Kategori" className="col mb-2" error="*Kategori harus di isi" url='perpustakaan/kategori/select' placeholder="Pilih Kategori" selected={[this.state.perpustakaan_self.kategori.kategori_id, this.state.perpustakaan_self.kategori.nama]} />
            <Select name="koleksi_id" title="Koleksi" className="col mb-2" error="*Koleksi harus di isi" url='perpustakaan/koleksi/select' placeholder="Pilih Koleksi" selected={[this.state.perpustakaan_self.koleksi.koleksi_id, this.state.perpustakaan_self.koleksi.nama]} />
          </div>
          <div className="row">
            <Input name="pengarang" value={this.state.perpustakaan_self.pengarang} divClass="col-md-5 mb-2" title="Nama Pengarang Buku" capital error="*Nama Pengarang harus di isi" placeholder="Nama Pengarang" />
            <Select name="penerbit_id" title="Penerbit" className="col-md-5 mb-2" error="*Penerbit harus di isi" url='perpustakaan/penerbit/select' placeholder="Pilih Penerbit" selected={[this.state.perpustakaan_self.penerbit.penerbit_id, this.state.perpustakaan_self.penerbit.nama]} />
            <div className="col-md-2 mb-2">
              <small className="text-nowrap">Tahun Terbit</small>
              <InputMask mask="9999" defaultValue={this.state.perpustakaan_self.tahun} maskChar={null} type="text" name="tahun" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan tahun" />
            </div>
          </div>
          <div className="row">
            <Input name="sumber" value={this.state.perpustakaan_self.sumber} divClass="col-md-9 mb-2" title="Sumber Buku" placeholder="Opsional (Contoh: Inventaris / Donasi Siswa / Dll)" />
            <div className="col-md-3 mb-2">
              <small className="text-nowrap">Stok</small>
              <InputMask mask="99999" defaultValue={this.state.perpustakaan_self.stok} maskChar={null} type="text" name="stok" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
          </div>
          <Text name="keterangan" value={this.state.perpustakaan_self.keterangan} divClass="w-100 mb-2" title="Keterangan" placeholder="Keterangan Opsional (Tulis jika membutuhkan keterangan)" rows="5" />
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="alert alert-light py-1 px-4 pointer mr-2" data-dismiss="modal"> Tutup </button>
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
              <p className="m-0 lh-15 alert alert-warning">
                Menghapus perpustakaan menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus perpustakaan <span className="text-danger strong h5">{(this.state.perpustakaan_self.judul || '').toUpperCase()}</span> ?
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
          <div className="row">
            <div className="col p-0 text-center">
              <img src={this.state.cover} ref={i => this.img = i} alt="img" className={this.state.perpustakaan_self.img ? 'w-100' : 'p-5 '} />
            </div>
          </div>
          <hr className="row mt-0 mb-3"/>
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
          <div className="col">
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
        <div className="col">
          <div className="card no-b shadow-lg radius-10">
            <div className="card-header bg-white b-0 px-2 py-2">
              <div className="row align-items-center">
                <div className="col pr-0">
                  <div className="form-group has-icon m-0">
                    <i className="la la-search" />
                    <input onChange={this.searcPerpustakaan.bind(this)} onClick={this.searcPerpustakaan.bind(this)} ref={i => this.search = i} className="form-control form-control-sm bg-light radius-5 search" placeholder="Pencarian" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto pl-2 text-right">
                  <span className="alert alert-info py-1 px-2 pointer f-9" data-toggle="modal" data-target="#tambah-mdl" onClick={() => setTimeout(() => this.addForm.querySelector('input[name="judul"]').focus(), 100)}><i className="la la-plus mr-1"></i><strong>Tambah Buku</strong></span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover mb-0 table-nowrap" id="table-perpustakaan">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs text-center">#</th>
                        <th className="sticky bg-white shadow-xs">Judul</th>
                        <th className="sticky bg-white shadow-xs">Bahasa</th>
                        <th className="sticky bg-white shadow-xs">Kategori</th>
                        <th className="sticky bg-white shadow-xs">Koleksi</th>
                        <th className="sticky bg-white shadow-xs">Pengarang</th>
                        <th className="sticky bg-white shadow-xs">Tahun</th>
                        <th className="sticky bg-white shadow-xs">Keterangan</th>
                        <th className="sticky bg-white shadow-xs" colSpan={2}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.perpustakaan.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center bold">{index+1}.</td>
                              <td className="text-center">
                                <div className="pointer user_avatar_xxs oh" data-toggle="modal" data-target="#add-img-mdl" onClick={() => this.setState({perpustakaan_self:r})}>
                                  {
                                    r.img ?
                                    <img className="radius-20 w-100" src={con.img+'/book/thumb/'+r.img+'?'+Random.generate()} alt="img" onClick={() => this.setState({cover:con.img + '/book/' + r.img +'?'+Random.generate()})} />
                                    :
                                    <i className="la la-book-open la-lg" onClick={() => this.setState({cover:con.img + '/book.png'})} />
                                  }
                                </div>
                              </td>
                              <td className="bolder f-9"><Pop content={r.judul} length="3" /></td>
                              <td className="bold f-9">{r.bahasa}</td>
                              <td className="bolder f-8">{r.kategori.nama}</td>
                              <td className="bold f-9"><Pop text={r.koleksi.nama} title={r.koleksi.nama} content={r.koleksi.keterangan} length="3" className="badge badge-light border border-gray f-8 bolder py-1 px-2 badge-pill" /></td>
                              <td className="bold f-9">{r.pengarang}</td>
                              <td className="bold f-9">{r.tahun}</td>
                              <td className="bold f-9"><Pop title="Keterangan" content={r.keterangan} length="3" className="f-8 bolder" /></td>
                              <td className="bold f-9"><Status value={r.status} /></td>
                              <td className="text-right text-nowrap">
                                <span className="btn-fab btn-fab-xs btn-warning-light mr-2" data-toggle="modal" data-target="#edit-perpustakaan-mdl" onClick={() => this.setState({perpustakaan_self:r}, () => setTimeout(() => this.editForm.querySelector('input[name="judul"]').focus(), 100))}><i className="la la-pen"></i></span>
                                <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-perpustakaan-mdl" onClick={() => this.setState({perpustakaan_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='tambah-mdl' size='lg' title='Tambah Buku' body={<ModalAdd />} />
          <Modal id='edit-perpustakaan-mdl' size='lg' title='Edit Perpustakaan' body={<ModalEdit />} />
          <Modal id='delete-perpustakaan-mdl' size='md' title='Hapus Perpustakaan' body={<ModalDelete />} />
          <Modal id='add-img-mdl' size='sm' title='Cover Buku' body={<ModalAddImg />} bodyClass="pt-0" />
        </div>
      </div>
    );
  }
}
export default Perpustakaan
