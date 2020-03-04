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
    axios.get(con.api+'/keuangan/setting', {headers:con.headers}).then(res => {
      this.setState({ setting:res.data });
    });
  }
  submit(){
    const q = {};
    q['spp'] = this.addForm.querySelector('input[name="spp"]').value;
    q['bangunan'] = this.addForm.querySelector('input[name="bangunan"]').value;
    q['seragam'] = this.addForm.querySelector('input[name="seragam"]').value;
    q['kesiswaan'] = this.addForm.querySelector('input[name="kesiswaan"]').value;
    q['daftar_ulang'] = this.addForm.querySelector('input[name="daftar_ulang"]').value;
    q['ppdb'] = this.addForm.querySelector('input[name="ppdb"]').value;
    if (true) {
      axios.post(con.api+'/keuangan/setting/update', q, {headers:con.headers})
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
                <div className="row mb-2">
                  <Uang name="spp" iconText="Rp." title="Uang SPP" divClass="col-md" className="f-10 bolder text-info" value={this.state.setting.spp || '0'} />
                  <Uang name="bangunan" iconText="Rp." title="Uang Bangunan" divClass="col-md" className="f-10 bolder text-info" value={this.state.setting.bangunan || '0'} />
                  <Uang name="seragam" iconText="Rp." title="Uang Seragam" divClass="col-md" className="f-10 bolder text-info" value={this.state.setting.seragam || '0'} />
                </div>
                <div className="row">
                  <Uang name="kesiswaan" iconText="Rp." title="Uang Kesiswaan" divClass="col-md" className="f-10 bolder text-info" value={this.state.setting.kesiswaan || '0'} />
                  <Uang name="daftar_ulang" iconText="Rp." title="Daftar Ulang" divClass="col-md" className="f-10 bolder text-info" value={this.state.setting.daftar_ulang || '0'} />
                  <Uang name="ppdb" iconText="Rp." title="PPDB" divClass="col-md" className="f-10 bolder text-info" value={this.state.setting.ppdb || '0'} />
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
