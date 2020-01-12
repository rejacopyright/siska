import React from 'react';
import con from '../api/connection';
import '../api/auth';
import {Link} from "react-router-dom";
class header  extends React.Component {
  constructor(){
    super();
    this.state = {
      admin:JSON.parse(localStorage.admin)
    }
  }
  render () {
    return (
      <div className="sticky z-999">
        <div className="navbar navbar-expand navbar-dark d-flex justify-content-between bd-navbar bg-white shadow-xs">
          <div className="relative">
            <div className="d-flex align-items-center">
              <div>
                <span className="paper-nav-toggles toggle-canvas pp-nav-toggles"> <i className="la la-bars toggle-side text-dark la-lg" /> </span>
              </div>
            </div>
          </div>
          <div className="navbar-custom-menu pt-2">
            <ul className="nav navbar-nav">
              <li className="dropdown custom-dropdown messages-menu">
                <span className="nav-link" data-toggle="dropdown">
                  <i className="la la-comment p-0 f-18 text-dark" />
                  <span className="badge badge-danger badge-mini rounded-circle">4</span>
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <ul className="menu pl-2 pr-2">
                      <li>
                        <Link to='/123'>
                          <div className="avatar float-left">
                            <img src={require("../assets/img/dummy/u4.png")} alt="img" />
                            <span className="avatar-badge busy" />
                          </div>
                          <h4> Support Team <small><i className="la la-clock-o pr-1" /> 5 mins</small> </h4>
                          <p> Why not buy a new awesome theme? </p>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="footer s-12 p-2 text-center"> <Link to='message'> See All Messages </Link> </li>
                </ul>
              </li>
              <li className="dropdown custom-dropdown user user-menu">
                <span className="nav-link" data-toggle="dropdown">
                  <img src={con.img+'/user/thumb/'+(this.state.admin.avatar || '../../user.png')+'?'+Date.now()} className={`user-image ${this.state.admin.avatar === null && 'border p-1'}`} alt="User" />
                </span>
                <div className="dropdown-menu p-2">
                  <div className="row m-0 justify-content-between">
                    <div className="col text-center">
                      <Link to='#'>
                        <i className="la la-umbrella f-18 p-1 text-primary radius-10" />
                        <div className="f-8">Vendor</div>
                      </Link>
                    </div>
                    <div className="col text-center">
                      <Link to='#'>
                        <i className="la la-user f-18 p-1 text-primary radius-10" />
                        <div className="f-8">Profile</div>
                      </Link>
                    </div>
                    <div className="col text-center">
                      <Link to='#'>
                        <i className="la la-user f-18 p-1 text-primary radius-10" />
                        <div className="f-8">Testing</div>
                      </Link>
                    </div>
                    <div className="col text-center">
                      <Link to='#' onClick={() => this.props.onLogout(localStorage.clear())}>
                        <i className="la la-power-off f-18 p-1 text-primary radius-10" />
                        <div className="f-8">Logout</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default header;
