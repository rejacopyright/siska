import React from 'react';
import axios from 'axios';
import con from '../api/connection';
import Uang from '../misc/uang';
import Notif from '../misc/notif';
class Setting extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      setting:{},
      notifBg:'success',
      notifMsg:''
    }
  }
  componentDidMount() {
    axios.get(con.api+'/perpustakaan/setting', {headers:con.headers}).then(res => {
      this.setState({ setting:res.data });
    });
  }
  submit(){
    const q = {};
    q['harga'] = this.addForm.querySelector('input[name="harga"]').value;
    q['durasi'] = this.addForm.querySelector('input[name="durasi"]').value;
    q['limit'] = this.addForm.querySelector('input[name="limit"]').value;
    q['denda_terlambat'] = this.addForm.querySelector('input[name="denda_terlambat"]').value;
    q['denda_rusak'] = this.addForm.querySelector('input[name="denda_rusak"]').value;
    q['denda_hilang'] = this.addForm.querySelector('input[name="denda_hilang"]').value;
    if (q.durasi) {
      axios.post(con.api+'/perpustakaan/setting/update', q, {headers:con.headers})
      .then(res => {
        this.setState({
          setting:res.data,
          notifBg:'success',
          notifMsg:'Setting berhasil diupdate'
        }, () => document.querySelector('.notif-show').click());
      });
    }else {
      this.setState({ notifBg:'danger', notifMsg:'Mohon periksa kembali kelengkapan data yang harus di isi' }, () => document.querySelector('.notif-show').click());
    }
  }
  render() {
    return (
      <React.Fragment>
        <div className="d-flex pb-5" ref={i => this.addForm = i}>
          <div className="col-md-10 offset-md-1 p-0">
            <Notif close duration="5000" bg={this.state.notifBg} v="bottom" h="center" message={this.state.notifMsg} />
            <div className="bg-primary text-center text-white f-10 py-1">Pengaturan Peminjaman Buku Perpustakaan</div>
            <div className="card no-b shadow-lg ov">
              <div className="card-body py-3 radius-10">
                <div className="row">
                  <Uang name="harga" iconText="Rp." title="Harga Pinjam" divClass="col-md" note="*Kosongkan / beri nilai '0' jika gratis" value={this.state.setting.harga} />
                  <Uang name="durasi" iconText="Hari" right title="Durasi Pinjam" divClass="col-md" error="*Durasi Pinjam harus di isi" value={this.state.setting.durasi || 1} />
                  <Uang name="limit" iconText="Buku" right title="Batas Pemesanan / orang" divClass="col-md" note="*Kosongkan jika tidak dibatas" value={this.state.setting.limit} />
                </div>
                <div className="row">
                  <Uang name="denda_terlambat" iconText="Rp." title="Denda Terlambat / Hari" divClass="col-md" value={this.state.setting.denda_terlambat} />
                  <Uang name="denda_rusak" iconText="Rp." title="Denda Rusak" divClass="col-md" value={this.state.setting.denda_rusak} />
                  <Uang name="denda_hilang" iconText="Rp." title="Denda Hilang" divClass="col-md" value={this.state.setting.denda_hilang} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed-bottom p-3 bg-white z-99 shadow-lg border-top">
          <div className="text-right">
            <span onClick={this.props.history.goBack} className="alert alert-light py-2 mr-2 pointer">KEMBALI</span>
            <span className="btn btn-xs btn-success py-1 px-3 radius-5 pointer f-12" onClick={this.submit.bind(this)}>UPDATE</span>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Setting
