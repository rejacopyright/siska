import React from 'react';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import con from '../api/connection';
import { Scrollbars } from 'react-custom-scrollbars';
import Text from '../misc/text';
import Modal from '../misc/modal';
import Select from '../misc/select';
import InputMask from 'react-input-mask';
import Pop from '../misc/popover';
import Notif from '../misc/notif';
import Radio from '../misc/radio';
import moment from 'moment';
import 'moment/locale/id';
function Status(props){
  switch (props.value) {
    case 1:
      return <span className="badge badge-light border border-gray f-8 bolder py-1 px-2 badge-pill">Dipesan</span>;
    case 2:
      return <span className="badge badge-light border border-gray f-8 bolder py-1 px-2 badge-pill">Dispp</span>;
    case 3:
      return <span className="badge badge-success-light border border-success f-8 bolder py-1 px-2 badge-pill">Dikembalikan</span>;
    case 4:
      return <span className="badge badge-warning-light border border-warning f-8 bolder py-1 px-2 badge-pill">Rusak</span>;
    case 5:
      return <span className="badge badge-danger-light border border-danger f-8 bolder py-1 px-2 badge-pill">Hilang</span>;
    case 6:
      return <span className="badge badge-info-light border border-info f-8 bolder py-1 px-2 badge-pill">Diperpanjang</span>;
    case 7:
      return <span className="badge badge-danger-light border border-danger f-8 bolder py-1 px-2 badge-pill">Expired</span>;
    default:
    return <i className="la la-times-circle text-danger" />;
  }
}
class SPP extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      bulan:[{id:1,text:'Januari'},{id:2,text:'Februari'},{id:3,text:'Maret'},{id:4,text:'April'},{id:5,text:'Mei'},{id:6,text:'Juni'},{id:7,text:'Juli'},{id:8,text:'Agustus'},{id:9,text:'September'},{id:10,text:'Oktober'},{id:11,text:'November'},{id:12,text:'Desember'}],
      spp:{siswa:{},buku:{},durasi:{}},
      spp_page:1,
      spp_search:'',
      spp_self:{siswa:{},buku:{},durasi:{}},
      loading:true,
      notifBg:'success',
      notifMsg:''
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'SPP';
    this._isMounted && axios.get(con.api+'/keuangan/spp', {headers:con.headers, params:{page:this.state.spp_page}})
    .then(res => {
      this.setState({ spp:res.data.spp, loading:false });
    });
    }
  componentWillUnmount() {
    this._isMounted = false;
  }
  add(e){
    e.preventDefault();
    const q = {};
    q['siswa_id'] = this.addForm.querySelector('select[name="siswa_id"]').value;
    q['spp_id'] = this.addForm.querySelector('select[name="spp_id"]').value;
    q['keterangan'] = this.addForm.querySelector('textarea[name="keterangan"]').value;
    if (q.siswa_id && q.spp_id) {
      axios.post(con.api+'/keuangan/spp/store', q, {headers:con.headers})
      .then(res => {
        this.setState({
          spp:res.data.spp,
          spp_page:1,
          notifBg:'success',
          notifMsg:'SPP berhasil dibuat'
        }, () => document.querySelector('.notif-show').click());
        document.getElementById('table-spp').parentElement.scrollTo(0,0);
      });
    }else {
      this.setState({ notifBg:'danger', notifMsg:'Mohon periksa kembali kelengkapan data yang harus di isi' }, () => document.querySelector('.notif-show').click());
    }
  }
  edit(e){
    e.preventDefault();
    const q = {spp_id:this.state.spp_self.spp_id};
    q['siswa_id'] = this.editForm.querySelector('select[name="siswa_id"]').value;
    q['spp_id'] = this.editForm.querySelector('select[name="spp_id"]').value;
    q['keterangan'] = this.editForm.querySelector('textarea[name="keterangan"]').value;
    q['status'] = this.editForm.querySelector('input[name="status"]:checked').value;
    axios.post(con.api+'/keuangan/spp/update', q, {headers:con.headers})
    .then(res => {
      this.setState({
        spp:res.data.spp,
        spp_page:1,
        notifBg:'success',
        notifMsg:'SPP berhasil diupdate'
      }, () => document.querySelector('.notif-show').click());
      document.getElementById('table-spp').parentElement.scrollTo(0,0);
    });
  }
  extend(e){
    e.preventDefault();
    const q = {spp_id:this.state.spp_self.spp_id};
    q['tgl_dikembalikan'] = this.extendForm.querySelector('input[name="tgl_dikembalikan"]').value;
    axios.post(con.api+'/keuangan/spp/extend', q, {headers:con.headers})
    .then(res => {
      this.setState({
        spp:res.data.spp,
        spp_page:1,
        notifBg:'success',
        notifMsg:'SPP berhasil diperpanjang'
      }, () => document.querySelector('.notif-show').click());
      document.getElementById('table-spp').parentElement.scrollTo(0,0);
    });
  }
  undoExtend(q){
    axios.post(con.api+'/keuangan/spp/extend/undo', q, {headers:con.headers})
    .then(res => {
      this.setState({
        spp:res.data.spp,
        spp_page:1,
        notifBg:'success',
        notifMsg:'Berhasil mengurungkan perpanjangan'
      }, () => document.querySelector('.notif-show').click());
      document.getElementById('table-spp').parentElement.scrollTo(0,0);
    });
  }
  delete(e){
    let q = {spp_id: this.state.spp_self.spp_id};
    axios.post(con.api+'/keuangan/spp/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ spp:res.data.spp });
      document.getElementById('table-spp').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/keuangan/spp', {headers:con.headers, params:{page:this.state.spp_page + 1, q:this.state.spp_search}})
      .then(res => {
        if (res.data.spp.length) {
          this.setState({ spp:this.state.spp.concat(res.data.spp), spp_page:this.state.spp_page + 1, loading:false });
        }
      });
    }
  }
  searcSPP(e){
    axios.get(con.api+'/keuangan/spp', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ spp:res.data.spp, spp_page:1, spp_search:res.config.params.q });
    });
  }
  render() {
    const ModalAdd = () => {
      return (
        <div ref={i => this.addForm = i}>
          <div className="row">
            <Select name="siswa_id" title="Siswa" className="col-12 mb-2" error="*Siswa harus di isi" url='siswa/select' placeholder="Pilih Siswa" />
            <Select name="periode" title="Periode" className="col-md mb-2" error="*Periode harus di isi" data={this.state.bulan} placeholder="Pilih Periode" />
            <div className="col-md mb-2">
              <small className="text-nowrap">Tahun</small>
              <InputMask mask="9999" maskChar={null} type="text" name="tahun" className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder="Isi dengan angka" />
            </div>
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
            <Select name="siswa_id" title="Siswa" className="col-md mb-2" error="*Siswa harus di isi" url='siswa/select' placeholder="Pilih Siswa" selected={[this.state.spp_self.siswa.siswa_id, this.state.spp_self.siswa.nama]} />
            <Select name="spp_id" title="Periode" className="col-md mb-2" error="*Periode harus di isi" url='spp/select' placeholder="Pilih Periode" selected={[this.state.spp_self.buku.spp_id, this.state.spp_self.buku.judul]} />
            <Text name="keterangan" divClass="col-12 mb-2" title="Keterangan" placeholder="Keterangan Opsional (Tulis jika membutuhkan keterangan)" rows="5" value={this.state.spp_self.keterangan} />
          </div>
          <div className="row align-items-center py-3">
            <div className="col px-0"><hr className="m-0" /></div>
            <div className="col-auto"><span className="alert alert-info py-1 bolder">Status Peminjaman</span></div>
            <div className="col px-0"><hr className="m-0" /></div>
          </div>
          <Radio name="status" setOption={{1:'Dipesan', 2:'Dispp', 3:'Dikembalikan', 4:'Rusak', 5:'Hilang'}} checked={this.state.spp_self.status} divClass="justify-content-center" />
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
    const ModalExtend = () => {
      return (
        <div ref={i => this.extendForm = i}>
          <div className="row">
            <div className="col-12 text-center mb-2">
              <small className="text-nowrap">Perpanjang Sampai <p className="mb-0 text-info strong f-12">{moment(this.state.spp_self.tgl_dikembalikan).add(this.state.spp_self.durasi || 1, 'days').format('DD MMMM YYYY')} ?</p></small>
              <input type="hidden" name="tgl_dikembalikan" defaultValue={moment(this.state.spp_self.tgl_dikembalikan).add(this.state.spp_self.durasi || 1, 'days').format('YYYY-MM-DD H:mm:ss')} />
            </div>
          </div>
          <hr className="row my-2"/>
          <div className="row">
            <div className="col-12 text-right">
              <button className="alert alert-light py-1 px-4 pointer mr-2" data-dismiss="modal"> Tutup </button>
              <button className="alert alert-success py-1 px-4 pointer" onClick={this.extend.bind(this)} data-dismiss="modal"> Perpanjang </button>
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
                Menghapus spp menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus spp <span className="text-danger strong h5">{(this.state.spp_self.nama || '').toUpperCase()}</span> ?
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
          <Notif close duration="5000" bg={this.state.notifBg} v="bottom" h="center" message={this.state.notifMsg} />
          <div className="card no-b shadow-lg radius-10">
            <div className="card-header bg-white b-0 px-2 py-2">
              <div className="row align-items-center">
                <div className="col pr-0">
                  <div className="form-group has-icon m-0">
                    <i className="la la-search" />
                    <input onChange={this.searcSPP.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Cari NIS atau nama siswa" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto pl-2 text-right">
                  <span className="alert alert-info py-1 px-2 pointer f-9" data-toggle="modal" data-target="#tambah-mdl"><i className="la la-plus mr-1"></i><strong>Transaksi SPP</strong></span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover table-nowrap mb-0" id="table-spp">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs">Tgl Transaksi</th>
                        <th className="sticky bg-white shadow-xs">Siswa</th>
                        <th className="sticky bg-white shadow-xs">Periode</th>
                        <th className="sticky bg-white shadow-xs">Keterangan</th>
                        <th className="sticky bg-white shadow-xs" colSpan={2}>#</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.spp.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center bold">{index+1}.</td>
                              <td className="bolder f-8">{r.siswa.nis} ({r.siswa.nama})</td>
                              <td className="bolder f-8"><Pop title="Judul Buku" content={r.buku.judul} length="3" /></td>
                              <td className="bold f-8">{moment(r.tgl_dikembalikan).isBefore() && (r.status === 2 || r.status === 6) ? <Status value={7} /> : <Status value={r.status} />}</td>
                              <td className="bold f-8">{moment(r.tgl_spp).format('Do/MM/YYYY H:mm')}</td>
                              <td className="bold f-8">{moment(r.tgl_dikembalikan).format('Do/MM/YYYY H:mm')}</td>
                              <td className="bold f-8"><Pop title="Keterangan" content={r.keterangan} length="3" /></td>
                              <td className="text-right text-nowrap">
                                {
                                  moment(r.tgl_dikembalikan).isAfter() && r.status === 2 ?
                                  <span className="btn-fab btn-fab-xs btn-info-light mr-2" data-toggle="modal" data-target="#extend-spp-mdl" onClick={() => this.setState({spp_self:r})}><i className="la la-history"></i></span>
                                  :
                                  moment(r.tgl_dikembalikan).isAfter() && r.status === 6 ?
                                  <span className="btn-fab btn-fab-xs btn-danger-light mr-2" onClick={() => this.undoExtend({spp_id:r.spp_id, tgl_dikembalikan:moment(r.tgl_dikembalikan).subtract(r.durasi || 1, 'days').format('YYYY-MM-DD H:mm:ss')})}><i className="la la-history"></i></span>
                                  :''
                                }
                                <span className="btn-fab btn-fab-xs btn-warning-light mr-2" data-toggle="modal" data-target="#edit-spp-mdl" onClick={() => this.setState({spp_self:r})}><i className="la la-pen"></i></span>
                                <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-spp-mdl" onClick={() => this.setState({spp_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='tambah-mdl' size='md' title='Transaksi SPP' body={<ModalAdd />} />
          <Modal id='edit-spp-mdl' size='md' title='Edit SPP' body={<ModalEdit />} />
          <Modal id='extend-spp-mdl' size='sm' title='Perpanjang SPP' body={<ModalExtend />} />
          <Modal id='delete-spp-mdl' size='md' title='Hapus SPP' body={<ModalDelete />} />
        </div>
      </div>
    );
  }
}
export default SPP
