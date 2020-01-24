import React from 'react'
import JadwalDetail from './jadwal-detail';
import axios from 'axios';
import con from '../api/connection';
import moment from 'moment';
import 'moment/locale/id';
import Slider from "react-slick";
import "../assets/css/slick/slick.scss";
import Skeleton from 'react-skeleton-loader';
import Select from '../misc/select';
class Jadwal extends React.Component {
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      jadwal:[],
      kelas:{},
      hari:[],
      selectedDay:{},
      fLoading:true,
      hLoading:true,
      mapel:[]
    }
  }
  componentDidMount() {
    // console.log(new Date(Math.ceil(newValue.getTime() / (1000*60*5)) * (1000*60*5)));
    this._isMounted = true;
    document.title = 'Jadwal';
     if (this._isMounted) {
       axios.get(con.api+'/mapel/jadwal', {headers:con.headers}).then(res => {
         this.setState({
           jadwal:res.data.jadwal,
           hari:res.data.hari,
           selectedDay:res.data.firstDay,
           kelas:res.data.firstKelas,
           fLoading:false,
           hLoading:false
         });
       });
     }
  }
  onChange(i){
    if (this._isMounted) {
      axios.get(con.api+'/kelas/detail/'+i, {headers:con.headers, params:{page:this.state.jadwal_page}}).then(res => {
        this.setState({ kelas:res.data.kelas });
      });
    }
  }
  toggleDay(hari_id, libur) {
    if (this._isMounted && !libur) {
      axios.get(con.api+'/hari/'+hari_id, {headers:con.headers}).then(res => {
        this.setState({ selectedDay: res.data });
      });
    }
  }
  render () {
    const settings = { dots: false, infinite: false, speed: 500, slidesToShow: 5, slidesToScroll: 2, responsive: [ {breakpoint:900,settings:{slidesToShow:2}}, {breakpoint:480,settings:{slidesToShow:2}} ] }
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
                    <Select name="kelas_id" title="Pilih Kelas" className="col-12 mb-2" url='kelas/select' placeholder="Pilih Kelas" selected={[this.state.kelas.kelas_id, this.state.kelas.nama]} onChange={(i) => this.onChange(i)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        <div className="col-md-9">
          <div className="row sticky bg-white" style={{top:'2.75rem'}}>
            {
              this.state.hLoading ?
              <React.Fragment>
                <div className="col pr-1 mb-3"> <Skeleton width="100%" height="50px" borderRadius="10px" widthRandomness={0} /> </div>
                <div className="col px-1 mb-3"> <Skeleton width="100%" height="50px" borderRadius="10px" widthRandomness={0} /> </div>
                <div className="col px-1 mb-3"> <Skeleton width="100%" height="50px" borderRadius="10px" widthRandomness={0} /> </div>
                <div className="col pl-1 mb-3"> <Skeleton width="100%" height="50px" borderRadius="10px" widthRandomness={0} /> </div>
              </React.Fragment>
              :
              <div className="col mt-1">
                <Slider {...settings}>
                  {
                    this.state.hari.map((r, index) => (
                      <div key={index} className={`card radius-5 mb-3 no-drag ${this.state.selectedDay.hari_id === r.hari_id && !r.libur ? 'bg-info-light text-info border border-info' : 'text-dark'}`} onClick={(i) => this.toggleDay(r.hari_id, r.libur)}>
                        <div className="card-body p-2 d-flex align-items-center">
                          <div><p className="m-0 bolder">{r.nama}</p><p className="m-0 f-9">{moment(r.created_at).format('H:mm:ss')}</p></div>
                          <div className="ml-auto"><i className={`text text-${r.libur ? 'danger' : 'info'} la la-${r.libur ? 'times' : 'check-circle'}`}></i></div>
                        </div>
                      </div>
                    ))
                  }
                </Slider>
              </div>
            }
          </div>
          <JadwalDetail kelas={this.state.kelas} hari={this.state.selectedDay} />
        </div>
      </div>
    )
  }
}

export default Jadwal;
