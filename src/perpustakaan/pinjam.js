import React from 'react';
import Skeleton from 'react-skeleton-loader';
import axios from 'axios';
import con from '../api/connection';
import { Scrollbars } from 'react-custom-scrollbars';
import Text from '../misc/text';
import Modal from '../misc/modal';
import Select from '../misc/select';
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
      return <span className="badge badge-light border border-gray f-8 bolder py-1 px-2 badge-pill">Dipinjam</span>;
    case 3:
      return <span className="badge badge-info-light border border-info f-8 bolder py-1 px-2 badge-pill">Dikembalikan</span>;
    case 4:
      return <span className="badge badge-warning-light border border-warning f-8 bolder py-1 px-2 badge-pill">Rusak</span>;
    case 5:
      return <span className="badge badge-danger-light border border-danger f-8 bolder py-1 px-2 badge-pill">Hilang</span>;
    case 6:
      return <span className="badge badge-danger-light border border-danger f-8 bolder py-1 px-2 badge-pill">Expired</span>;
    default:
    return <i className="la la-times-circle text-danger" />;
  }
}
class Pinjam extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      pinjam:{siswa:{},buku:{}},
      pinjam_page:1,
      pinjam_search:'',
      pinjam_self:{siswa:{},buku:{}},
      loading:true,
      notifBg:'success',
      notifMsg:''
    }
  }
  componentDidMount() {
    this._isMounted = true;
    document.title = 'Pinjam';
    this._isMounted && axios.get(con.api+'/perpustakaan/pinjam', {headers:con.headers, params:{page:this.state.pinjam_page}})
    .then(res => {
      this.setState({ pinjam:res.data.pinjam, loading:false });
    });
    }
  componentWillUnmount() {
    this._isMounted = false;
  }
  add(e){
    e.preventDefault();
    const q = {};
    q['siswa_id'] = this.addForm.querySelector('select[name="siswa_id"]').value;
    q['perpustakaan_id'] = this.addForm.querySelector('select[name="perpustakaan_id"]').value;
    q['keterangan'] = this.addForm.querySelector('textarea[name="keterangan"]').value;
    if (q.siswa_id && q.perpustakaan_id) {
      axios.post(con.api+'/perpustakaan/pinjam/store', q, {headers:con.headers})
      .then(res => {
        this.setState({
          pinjam:res.data.pinjam,
          pinjam_page:1,
          notifBg:'success',
          notifMsg:'Pinjaman berhasil dibuat'
        }, () => document.querySelector('.notif-show').click());
        document.getElementById('table-pinjam').parentElement.scrollTo(0,0);
      });
    }else {
      this.setState({ notifBg:'danger', notifMsg:'Mohon periksa kembali kelengkapan data yang harus di isi' }, () => document.querySelector('.notif-show').click());
    }
  }
  edit(e){
    e.preventDefault();
    const q = {pinjam_id:this.state.pinjam_self.pinjam_id};
    q['siswa_id'] = this.editForm.querySelector('select[name="siswa_id"]').value;
    q['perpustakaan_id'] = this.editForm.querySelector('select[name="perpustakaan_id"]').value;
    q['keterangan'] = this.editForm.querySelector('textarea[name="keterangan"]').value;
    q['status'] = this.editForm.querySelector('input[name="status"]:checked').value;
    axios.post(con.api+'/perpustakaan/pinjam/update', q, {headers:con.headers})
    .then(res => {
      this.setState({
        pinjam:res.data.pinjam,
        pinjam_page:1,
        notifBg:'success',
        notifMsg:'Pinjaman berhasil diupdate'
      }, () => document.querySelector('.notif-show').click());
      document.getElementById('table-pinjam').parentElement.scrollTo(0,0);
    });
  }
  delete(e){
    let q = {pinjam_id: this.state.pinjam_self.pinjam_id};
    axios.post(con.api+'/perpustakaan/pinjam/delete', q, {headers:con.headers})
    .then(res => {
      this.setState({ pinjam:res.data.pinjam });
      document.getElementById('table-pinjam').parentElement.scrollTo(0,0);
    });
  }
  scroll(e){
    if (e.target.scrollHeight - e.target.parentElement.offsetHeight === e.target.scrollTop) {
      axios.get(con.api+'/perpustakaan/pinjam', {headers:con.headers, params:{page:this.state.pinjam_page + 1, q:this.state.pinjam_search}})
      .then(res => {
        if (res.data.pinjam.length) {
          this.setState({ pinjam:this.state.pinjam.concat(res.data.pinjam), pinjam_page:this.state.pinjam_page + 1, loading:false });
        }
      });
    }
  }
  searcPinjam(e){
    axios.get(con.api+'/perpustakaan/pinjam', {headers:con.headers, params:{q:e.target.value}})
    .then(res => {
      this.setState({ pinjam:res.data.pinjam, pinjam_page:1, pinjam_search:res.config.params.q });
    });
  }
  render() {
    const ModalAdd = () => {
      return (
        <div ref={i => this.addForm = i}>
          <div className="row">
            <Select name="siswa_id" title="Siswa" className="col-md" error="*Siswa harus di isi" url='siswa/select' placeholder="Pilih Siswa" />
            <Select name="perpustakaan_id" title="Buku" className="col-md" error="*Buku harus di isi" url='perpustakaan/select' placeholder="Pilih Buku" />
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
            <Select name="siswa_id" title="Siswa" className="col-md" error="*Siswa harus di isi" url='siswa/select' placeholder="Pilih Siswa" selected={[this.state.pinjam_self.siswa.siswa_id, this.state.pinjam_self.siswa.nama]} />
            <Select name="perpustakaan_id" title="Buku" className="col-md" error="*Buku harus di isi" url='perpustakaan/select' placeholder="Pilih Buku" selected={[this.state.pinjam_self.buku.perpustakaan_id, this.state.pinjam_self.buku.judul]} />
            <Text name="keterangan" divClass="col-12 mb-2" title="Keterangan" placeholder="Keterangan Opsional (Tulis jika membutuhkan keterangan)" rows="5" value={this.state.pinjam_self.keterangan} />
          </div>
          <div className="row align-items-center py-3">
            <div className="col px-0"><hr className="m-0" /></div>
            <div className="col-auto"><span className="alert alert-info py-1 bolder">Status Peminjaman</span></div>
            <div className="col px-0"><hr className="m-0" /></div>
          </div>
          <Radio name="status" setOption={{1:'Dipesan', 2:'Dipinjam', 3:'Dikembalikan', 4:'Rusak', 5:'Hilang'}} checked={this.state.pinjam_self.status} divClass="justify-content-center" />
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
    const ModalDelete = () => {
      return (
        <React.Fragment>
          <div className="row mb-2">
            <div className="col text-center">
              <p className="m-0 lh-15 alert alert-warning">
                Menghapus pinjam menyebabkan seluruh modul pelajaran akan terhapus.
                Apakah anda yakin ingin menghapus pinjam <span className="text-danger strong h5">{(this.state.pinjam_self.nama || '').toUpperCase()}</span> ?
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
                    <input onChange={this.searcPinjam.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder="Cari NIS, nama siswa, atau judul buku" type="text" autoComplete="off" />
                  </div>
                </div>
                <div className="col-auto pl-2 text-right">
                  <span className="alert alert-info py-1 px-2 pointer f-9" data-toggle="modal" data-target="#tambah-mdl"><i className="la la-plus mr-1"></i><strong>Pinjam Buku</strong></span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <Scrollbars style={{ height: 50+'vh' }} autoHide onScroll={this.scroll.bind(this)}>
                  <table className="table table-hover table-nowrap mb-0" id="table-pinjam">
                    <thead>
                      <tr>
                        <th className="text-center sticky bg-white shadow-xs">No.</th>
                        <th className="sticky bg-white shadow-xs">Peminjam</th>
                        <th className="sticky bg-white shadow-xs">Buku</th>
                        <th className="sticky bg-white shadow-xs">Status</th>
                        <th className="sticky bg-white shadow-xs">Tgl Pinjam</th>
                        <th className="sticky bg-white shadow-xs">Tgl Dikembalikan</th>
                        <th className="sticky bg-white shadow-xs" colSpan={2}>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.pinjam.map(
                          (r, index) => (
                            <tr key={index}>
                              <td className="text-center bold">{index+1}.</td>
                              <td className="bolder f-8">{r.siswa.nis} ({r.siswa.nama})</td>
                              <td className="bolder f-8"><Pop title="Judul Buku" content={r.buku.judul} length="3" /></td>
                              <td className="bold f-8">{moment(r.tgl_dikembalikan).isBefore(Date.now()) && r.status === 2 ? <Status value={6} /> : <Status value={r.status} />}</td>
                              <td className="bold f-8">{moment(r.tgl_pinjam).format('Do/MM/YYYY H:mm')}</td>
                              <td className="bold f-8">{moment(r.tgl_dikembalikan).format('Do/MM/YYYY H:mm')}</td>
                              <td className="bold f-8"><Pop title="Keterangan" content={r.keterangan} length="3" /></td>
                              <td className="text-right text-nowrap">
                                <span className="btn-fab btn-fab-xs btn-warning-light mr-2" data-toggle="modal" data-target="#edit-pinjam-mdl" onClick={() => this.setState({pinjam_self:r})}><i className="la la-pen"></i></span>
                                <span className="btn-fab btn-fab-xs btn-danger-light" data-toggle="modal" data-target="#delete-pinjam-mdl" onClick={() => this.setState({pinjam_self:r})}><i className="la la-trash"></i></span>
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
          <Modal id='tambah-mdl' size='md' title='Pinjam Buku' body={<ModalAdd />} />
          <Modal id='edit-pinjam-mdl' size='md' title='Edit Pinjam' body={<ModalEdit />} />
          <Modal id='delete-pinjam-mdl' size='md' title='Hapus Pinjam' body={<ModalDelete />} />
        </div>
      </div>
    );
  }
}
export default Pinjam
