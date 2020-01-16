import React from 'react'
import axios from 'axios';
import con from '../api/connection';
import moment from 'moment';
import 'moment/locale/id';
import Skeleton from 'react-skeleton-loader'
import Checkbox from '../misc/checkbox';
import { TimeInput } from 'material-ui-time-picker';
import Random from 'randomstring';
class Jadwal extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      jadwal:[],
      jadwal_page:1,
      jadwal_search:'',
      jadwal_self:{kelas:{},hari:{},mapel:{}},
      fLoading:true,
      cLoading:true,
      mapel:[],
      time:new Date()
    }
  }
  componentDidMount() {
    console.log(new Date(), moment().format());
    this._isMounted = true;
    document.title = 'Jadwal';
    this._isMounted && axios.get(con.api+'/jadwal', {headers:con.headers, params:{page:this.state.jadwal_page}}).then(res => {
      console.log(res.data);
      this.setState({ jadwal:res.data.jadwal, fLoading:false, cLoading:false });
    });
  }
  handleTime(i){
    this._isMounted && this.setState({ time:i });
  }
  render () {
    return(
      <div className="row">
        {
          this.state.fLoading ?
          <div className="col-md-3">
            <Skeleton width="100%" height="50px" borderRadius="10px" widthRandomness={0} />
            <Skeleton width="100%" height="15px" borderRadius="10px" widthRandomness={0.5} count={5} />
          </div>
          :
          <div className="col-md-3">
            <div className="sticky t-4 z-9">
              <div className="card no-b shadow-xs">
                <div className="p-3 bg-light border-bottom f-10 text-dark bolder text-left"><i className="la la-user la-lg mx-2" />Filter Berdasarkan</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md mb-2">
                      <Checkbox name="status" id="status" value="1" title="Aktifkan" className="mr-2" divClass="" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      testssdsdsd
                      <TimeInput mode='12h' value={this.state.time} onChange={(i) => this.handleTime(i)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {
          this.state.cLoading ?
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-6 mb-4"> <Skeleton width="100%" height="50px" borderRadius="10px" widthRandomness={0} /> <Skeleton width="100%" height="15px" borderRadius="10px" widthRandomness={0.5} count={5} /> </div>
              <div className="col-md-6 mb-4"> <Skeleton width="100%" height="50px" borderRadius="10px" widthRandomness={0} /> <Skeleton width="100%" height="15px" borderRadius="10px" widthRandomness={0.5} count={5} /> </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-4"> <Skeleton width="100%" height="50px" borderRadius="10px" widthRandomness={0} /> <Skeleton width="100%" height="15px" borderRadius="10px" widthRandomness={0.5} count={5} /> </div>
              <div className="col-md-6 mb-4"> <Skeleton width="100%" height="50px" borderRadius="10px" widthRandomness={0} /> <Skeleton width="100%" height="15px" borderRadius="10px" widthRandomness={0.5} count={5} /> </div>
            </div>
          </div>
          :
          <div className="col-md-9">
            <div className="row">
              {
                this.state.jadwal.map((r, index) => (
                  <div className="col-md-6 mb-3" key={index}>
                    <div className="card h-100 no-b shadow-xs">
                      <div className="card-body pb-4">
                        <div className="d-flex align-items-center">
                          <div className="mr-2">
                            <img src={con.img+'/user/thumb/'+(r.pengajar && r.pengajar.avatar ? r.pengajar.avatar : '../../user.png')+'?'+Random.generate()} alt="img" className="user_avatar_xs"/>
                          </div>
                          <div className="">
                            <p className="m-0 f-10 bolder text-info">{r.pengajar.nama}</p>
                            <p className="m-0 f-9 bolder badge badge-light py-1">{r.mapel}</p>
                          </div>
                          <div className="ml-auto text-right">
                            <p className="m-0 f-9 bolder badge badge-light py-1 text-capitalize">{r.semester}</p>
                          </div>
                        </div>
                        <table className="mt-3">
                          <tbody>
                            <tr>
                              <td className="lh-1 align-top"><span className="m-0 f-8 bolder badge badge-info-light py-1 mr-2">SK</span></td>
                              <td className="lh-1"><span className="f-8 bolder">{r.sk}</span></td>
                            </tr>
                            <tr>
                              <td className="lh-1 align-top"><span className="m-0 f-8 bolder badge badge-warning-light py-1 mr-2">KD</span></td>
                              <td className="lh-1"><span className="f-8 bolder">{r.kd}</span></td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="mt-3 f-11 lh-15 bolder"> {r.nama} </p>
                        <div className="position-absolute d-flex align-items-center w-100 b-0 r-0 mb-2">
                          <p className="mb-0 f-8 text-info bolder ml-3 mr-auto">{moment(r.created_at).format('DD MMM YYYY')}</p>
                          <p className="m-0 f-8 bolder badge badge-success-light py-1 mr-2">Selsai</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        }
      </div>
    )
  }
}

export default Jadwal;
