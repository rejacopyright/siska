import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// ASSETS
import 'bootstrap/dist/js/bootstrap.min.js';
import './assets/js/init';
import './assets/fonts/line-awesome/line-awesome.css';
import './assets/css/appv2.scss';
import './assets/css/customv2.scss';
// BASE
import Sidebar from './menu/side';
import Header from './menu/header';
import Page404 from './menu/404';
// MODUL KURIKULUM
import Mapel from './kurikulum/mapel';
import Silabus from './kurikulum/silabus';
import Rpp from './kurikulum/rpp';
import Materi from './kurikulum/materi';
import MateriAdd from './kurikulum/materiAdd';
import MateriEdit from './kurikulum/materiEdit';
import MateriModul from './kurikulum/materiModul';
// MODUL SISWA
import Siswa from './siswa/siswa';
import SiswaAlumni from './siswa/alumni';
import SiswaDaftar from './siswa/daftar';
import SiswaAdd from './siswa/add';
import SiswaEdit from './siswa/edit';
// MODUL PERPUSTAKAAN
import PerpusKategori from './perpustakaan/kategori';
import PerpusKoleksi from './perpustakaan/koleksi';
import PerpusPenerbit from './perpustakaan/penerbit';
import PerpusPinjam from './perpustakaan/pinjam';
import PerpusSetting from './perpustakaan/setting';
import Perpus from './perpustakaan/perpustakaan';
// MODUL SDM
import Jabatan from './sdm/jabatan';
import User from './sdm/user';
// MODUL MAPEL
import Pengajar from './mapel/pengajar';
import Jadwal from './mapel/jadwal';
// MODUL SETTINGS
import Kelas from './kelas/kelas';
import Semester from './semester/semester';

const Home = () => (<h1>Home</h1>);

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      title : 'Siska'
    }
  }
  render() {
    return (
      <Router>
        <Sidebar onLogout={() => this.props.onLogout()} />
        <div className="page has-sidebar-left vh-100">
          <Header onLogout={() => this.props.onLogout()} />
          <div className="container-fluid my-3">
            <Switch>
              <Route exact path="/"> <Home /> </Route>
              {/* Kurikulum */}
              <Route exact path="/kurikulum/mapel" component={Mapel} />
              <Route exact path="/kurikulum/silabus" component={Silabus} />
              <Route exact path="/kurikulum/rpp" component={Rpp} />
              <Route exact path="/kurikulum/materi" component={Materi} />
              <Route exact path="/kurikulum/materi/add" component={MateriAdd} />
              <Route exact path="/kurikulum/materi/edit/:materi_id" component={MateriEdit} />
              <Route exact path="/kurikulum/materi/modul/:materi_id" component={MateriModul} />
              {/* SISWA */}
              <Route exact path="/siswa" component={Siswa} />
              <Route exact path="/siswa/alumni" component={SiswaAlumni} />
              <Route exact path="/siswa/daftar" component={SiswaDaftar} />
              <Route exact path="/siswa/add" component={SiswaAdd} />
              <Route exact path="/siswa/edit/:siswa_id" component={SiswaEdit} />
              {/* SDM */}
              <Route exact path="/sdm/jabatan" component={Jabatan} />
              <Route exact path="/sdm/user" component={User} />
              {/* MAPEL */}
              <Route exact path="/mapel/pengajar" component={Pengajar} />
              <Route exact path="/mapel/jadwal" component={Jadwal} />
              {/* PERPUSTAKAAN */}
              <Route exact path="/perpustakaan/kategori" component={PerpusKategori} />
              <Route exact path="/perpustakaan/koleksi" component={PerpusKoleksi} />
              <Route exact path="/perpustakaan/penerbit" component={PerpusPenerbit} />
              <Route exact path="/perpustakaan/pengaturan" component={PerpusSetting} />
              <Route exact path="/perpustakaan" component={Perpus} />
              <Route exact path="/perpustakaan/pinjam" component={PerpusPinjam} />
              {/* SETTINGS */}
              <Route exact path="/sdm/kelas" component={Kelas} />
              <Route exact path="/semester" component={Semester} />
              {/* HANDLE PAGE */}
              <Route exact path="*" component={Page404} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
export default App;
