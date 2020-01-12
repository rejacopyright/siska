import React from 'react';
import {Link} from 'react-router-dom';
import con from '../api/connection';

class Page extends React.Component {
  render() {
    return (
      <div className="d-flex align-items-center justify-content-center p-0 vh-80">
        <div className="p-0">
          <h3 className="text-gray mt-0 mb-4 bold text-center">Halaman yang anda cari tidak ditemukan... !</h3>
          <img src={con.img+'/bg/4.svg'} className="opacity-3" alt="img" />
          <div className="row mt-4">
            <div className="col px-1 text-md-right text-center mb-2 mb-md-0">
              <span className="btn btn-sm btn-light radius-30 pointer text-nowrap" onClick={this.props.history.goBack}><i className="la la-arrow-left la-lg mr-2" />Ke Halaman Sebelumnya</span>
            </div>
            <div className="col px-1 text-md-left text-center">
              <Link to="/" className="btn btn-sm btn-info px-4 radius-30 pointer text-nowrap"><i className="la la-home la-lg mr-2" />Ke Halaman Utama</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Page
