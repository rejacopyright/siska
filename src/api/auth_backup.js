import React from 'react';
import con from './connection';
import App from '../app';
import Login from '../admin/login';
import $ from 'jquery';
import axios from 'axios';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin:JSON.parse(localStorage.getItem('admin')),
      auth:localStorage.getItem('auth')
    }
  }
  componentDidMount() {
    const t = this;
    $(document).on('click', '.login-btn', function(e){
      e.preventDefault();
      const q = {};
      const form = $(this).closest('form');
      const username = form.find('input[name="username"]').val();
      const password = form.find('input[name="password"]').val();
      if (username) { q['username'] = username; }
      if (password) { q['password'] = password; }
      axios.post(con.api + '/admin/login',q)
        .then(function (res){
          if (res.data) {
            t.setState({
              auth:localStorage.setItem('auth', true),
              admin:localStorage.setItem('admin', JSON.stringify(res.data))
            });
            // const token = t.state.token;
            // axios.get(con.api + '/admin/auth', {headers: { Authorization: 'Bearer '+token, Accept: 'application/json' }}).then(res => {t.setState({ auth:res.data }); console.log(res.data);}).catch(error => '');
          }
        });
      });
      $(document).on('click', '.logout-btn', function(e){
        e.preventDefault();
        t.setState({
          auth:localStorage.removeItem('auth'),
          admin:localStorage.removeItem('admin')
        });
      });
  }
  render() {
    const auth = localStorage.getItem('auth');
    function Dom(){ if (auth === 'true') { return <App /> }else { return <Login /> } }
    return <Dom />;
  }
}
export default Auth;
