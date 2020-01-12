import React from 'react';
import Login from '../admin/login';
import App from '../app';

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: localStorage.getItem('auth')
    }
  }
  componentDidMount() {
  }
  handleLogin = (data) => {
    window.location.reload();
    this.setState(data);
  }
  handleLogout = () => {
    this.setState({auth:false});
  }
  render() {
    const isAuth = this.state.auth === 'true';
    if (isAuth) {
      return <App onLogout={() => this.handleLogout()} />;
    }
    return <Login onLogin={(data) => this.handleLogin(data)} />;
  }
}
export default Auth;
