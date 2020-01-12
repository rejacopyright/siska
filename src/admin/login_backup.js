import React from 'react';
import con from '../api/connection';

class Login extends React.Component {
  componentDidMount() {
    document.title = 'Login';
  }
  render() {
    return (
      <main>
        <div id="primary" className="height-full bg-light pt-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-6 mx-md-auto">
                <div className="text-center">
                  <img src={require("../assets/img/woless-logo.png")} className="hpx-100 radius-50 border border-3 border-primary border-dash p-2" alt="img" />
                  <p className="mb-1 mt-2">
                    <img src={require("../assets/img/woless-letter.png")} alt="img" className="wpx-75" />
                    <sub> | </sub>
                    <sub className="change">Login</sub>
                  </p>
                  <p className="mt-0 lh-1"> Solusi wedding untuk anda </p>
                </div>
                <form>
                  <div className="form-group reja-input-icon">
                    <i className="la la-user" />
                    <input type="text" ref={(i) => this.username = i} name="username" className="form-control form-control-sm bg-white radius-30" placeholder="Username" required autoFocus autoComplete="off" />
                  </div>
                  <div className="form-group reja-input-icon">
                    <i className="la la-lock" />
                    <input type="password" ref={(i) => this.password = i} name="password" className="form-control form-control-sm bg-white radius-30" placeholder="Password" required autoComplete="off" />
                  </div>
                  <button type="button" className="btn btn-primary shadow-none radius-30 btn-block change login-btn" >Login</button>
                  <p className="text-center mt-2 lh-1">
                    <span className="quest"> Belum memiliki akun ? </span>
                    <a href="##" className="change change-btn">Registrasi</a>
                  </p>
                  <p className="text-center">atau</p>
                </form>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-6 mx-md-auto text-center">
                <a href={con.api + "/login/google"} className="btn radius-30 btn-sm btn-social mr-2 gplus"> <i className="lab la-google" /> Google </a>
                <a href={con.api + "/login/facebook"} className="btn radius-30 btn-sm btn-social mr-2 facebook"> <i className="lab la-facebook-f" /> Facebook </a>
                <a href={con.api + "/instagram"} className="btn radius-30 btn-sm btn-social instagram"> <i className="lab la-instagram" /> Instagram </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Login
