import React from 'react';
import con from '../api/connection';
import {Link} from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';
class side extends React.Component {
  constructor(){
    super();
    this.state = {
      admin:JSON.parse(localStorage.admin),
      height:0
    }
    this.sidebarHeight = window.innerHeight - 50;
  }
  componentDidMount() {
    let divScope = document.querySelector('.main-sidebar .sidebar').querySelectorAll(':scope > div');
    let sidebarHeight = this.sidebarHeight - (divScope[0].offsetHeight + divScope[1].offsetHeight);
    this.setState({
      height: sidebarHeight
    });
  }
  userSidebar(e){
    let sidebarHeight = this.sidebarHeight - (document.querySelector('.main-sidebar .sidebar').querySelectorAll(':scope > div')[0].offsetHeight + e.currentTarget.offsetHeight);
    this.setState({
      height: sidebarHeight
    });
  }
  render() {
    return (
      <aside className="main-sidebar fixed offcanvas shadow-md">
        <section className="sidebar">
          <div className="w-80px my-2 mx-3">
            <div className="d-flex m-auto align-items-center">
              <Link to="/" className="col-auto pl-0">
                <img src={con.img+'/logo.png'} alt="img" className="hpx-30 border radius-30 ppx-2" />
              </Link>
              <Link to="/" className="col-auto text-white px-0">SISKA</Link>
              <div className="col text-right px-0">
                <span className="toggle-canvas w-100 text-right"> <i className="la la-times text-white f-14" /> </span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="user-panel px-3 mb-2 py-0">
              <div className="d-flex align-items-center py-2 row pointer">
                <div className="col px-2">
                  <img className={"user_avatar_xs "+(this.state.admin.avatar ? '' : 'p-2')} src={con.img+'/user/thumb/'+(this.state.admin.avatar || '../../user.png')+'?'+Date.now()} alt="img"/>
                </div>
                <div className="col px-0">
                  <p className="mt-0 mb-1 bold text-nowrap text-white text-capitalize">{this.state.admin.nama}</p>
                  <p className="text-white bolder f-8 m-0">{this.state.admin.username}</p>
                </div>
                <div className="col text-right"> <i className="la la-chevron-circle-down text-white" /> </div>
              </div>
              <div className="clearfix" />
            </div>
          </div>
          <Scrollbars style={{ height: this.state.height+'px' }} autoHide>
            {/* KURIKULUM */}
            <div className="sidebar-title f-8 bold text-white p-2 position-relative pointer" data-toggle="collapse" href="#kurikulum-header" aria-expanded="false"><i className="la la-swatchbook la-lg pr-2" />KURIKULUM <i className="la la-angle-right right right-5 toggle-1" /></div>
            <ul className="sidebar-menu collapse" id="kurikulum-header">
              <li><Link to="/kurikulum/silabus"><i className="la la-book text-white la-lg" />Silabus</Link> </li>
              <li><Link to="/kurikulum/rpp"><i className="la la-book-open text-white la-lg" />RPP</Link> </li>
              <li><Link to="/kurikulum/materi"><i className="la la-pencil-alt text-white la-lg" />Materi</Link> </li>
            </ul>
            {/* MAPEL */}
            <div className="sidebar-title f-8 bold text-white p-2 position-relative pointer" data-toggle="collapse" href="#mapel-header" aria-expanded="false"><i className="la la-school la-lg pr-2" />MAPEL <i className="la la-angle-right right right-5 toggle-1" /></div>
            <ul className="sidebar-menu collapse" id="mapel-header">
              <li><Link to='/mapel/pengajar'><i className="la la-user-graduate la-lg" />Pengajar</Link> </li>
              <li><Link to='/mapel/jadwal'><i className="la la-calendar la-lg" />Jadwal</Link> </li>
            </ul>
            {/* SISWA */}
            <div className="sidebar-title f-8 bold text-white p-2 position-relative pointer" data-toggle="collapse" href="#siswa-header" aria-expanded="false"><i className="la la-user-tie la-lg pr-2" />SISWA <i className="la la-angle-right right right-5 toggle-1" /></div>
            <ul className="sidebar-menu collapse" id="siswa-header">
              <li><Link to="/siswa"><i className="la la-check-circle text-white la-lg" />Siswa</Link> </li>
              <li><Link to="/siswa/alumni"><i className="la la-history text-white la-lg" />Alumni</Link> </li>
              <li><Link to="/siswa/daftar"><i className="la la-door-open text-white la-lg" />Siswa Daftar</Link> </li>
            </ul>
            {/* PERPUSTAKAAN */}
            <div className="sidebar-title f-8 bold text-white p-2 position-relative pointer" data-toggle="collapse" href="#perpustakaan-header" aria-expanded="false"><i className="la la-book-open la-lg pr-2" />PERPUSTAKAAN <i className="la la-angle-right right right-5 toggle-1" /></div>
            <ul className="sidebar-menu collapse" id="perpustakaan-header">
              <li className="treeview">
                <Link to='#'> <i className="la la-cog la-lg" /> <span>Pengaturan</span> <i className="la la-angle-right pull-right" /> </Link>
                <ul className="treeview-menu">
                  <li><Link to="/perpustakaan/kategori"><i className="la la-folder-open text-white la-lg" />Kategori</Link> </li>
                  <li><Link to="/perpustakaan/koleksi"><i className="la la-archway text-white la-lg" />Koleksi</Link> </li>
                  <li><Link to="/perpustakaan/penerbit"><i className="la la-map-marker text-white la-lg" />Penerbit</Link> </li>
                  <li><Link to="/perpustakaan/pengaturan"><i className="la la-cog text-white la-lg" />Peminjaman</Link> </li>
                </ul>
              </li>
              <li><Link to="/perpustakaan"><i className="la la-book text-white la-lg" />Daftar Buku</Link> </li>
              <li><Link to="/perpustakaan/pinjam"><i className="la la-hand-lizard text-white la-lg" />Daftar Pinjam</Link> </li>
            </ul>
            {/* KEUANGAN */}
            <div className="sidebar-title f-8 bold text-white p-2 position-relative pointer" data-toggle="collapse" href="#keuangan-header" aria-expanded="false"><i className="la la-wallet la-lg pr-2" />KEUANGAN <i className="la la-angle-right right right-5 toggle-1" /></div>
            <ul className="sidebar-menu collapse" id="keuangan-header">
              <li><Link to="/keuangan/spp"><i className="la la-calendar text-white la-lg" />SPP</Link> </li>
              <li><Link to="/keuangan/pengaturan"><i className="la la-cog text-white la-lg" />Pengaturan</Link> </li>
            </ul>
            {/* PENGATURAN */}
            <div className="sidebar-title f-8 bold text-white p-2 position-relative pointer" data-toggle="collapse" href="#pengaturan-header" aria-expanded="false"><i className="la la-cog la-lg pr-2" />PENGATURAN <i className="la la-angle-right right right-5 toggle-1" /></div>
            <ul className="sidebar-menu collapse" id="pengaturan-header">
              <li className="treeview">
                <Link to='#'> <i className="la la-user-friends la-lg" /> <span>SDM</span> <i className="la la-angle-right pull-right" /> </Link>
                <ul className="treeview-menu">
                  <li><Link to='/sdm/jabatan'><i className="la la-briefcase la-lg" />Jabatan</Link> </li>
                  <li><Link to='/sdm/user'><i className="la la-user la-lg" />User</Link> </li>
                </ul>
              </li>
              <li><Link to="/kurikulum/mapel"><i className="la la-book-open text-white la-lg" />Mata Pelajaran</Link> </li>
              <li><Link to='/sdm/kelas'><i className="la la-warehouse la-lg" />Kelas</Link> </li>
              <li><Link to='/semester'><i className="la la-clock la-lg" />Semester</Link> </li>
            </ul>
          </Scrollbars>
        </section>
      </aside>
    );
  }
}
export default side;
