import React from 'react';
import axios from 'axios';
import con from '../api/connection';
class Username extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:this.props.value || '',
      exist: this.props.value,
      error:this.props.value ? '' : this.props.error
    }
  }
  UNSAFE_componentWillReceiveProps(props) {
    if (props.value) {
      let val = props.value.replace(/\s+/g, '');
      let params = { username:val }
      if (props.value) { params['except'] = props.value; }
      this.setState({ value:val });
      axios.get(con.api+'/admin/check/username',{ headers:con.headers, params:params })
      .then((res) => {
        if (res.data) {
          this.setState({ exist:true, error: '*Username tidak tersedia' });
        }else {
          this.setState({ exist:false, error: '' });
        }
      });
    }else {
      this.setState({ value: '', exist: false, error:props.error });
    }
  }
  value = (e) => {
    let val = e.target.value.replace(/\s+/g, '');
    if (val) {
      let params = { username:val }
      if (this.props.value) { params['except'] = this.props.value; }
      this.setState({ value:val });
      axios.get(con.api+'/admin/check/username',{ headers:con.headers, params:params })
      .then((res) => {
        if (res.data) {
          this.setState({ exist:true, error: '*Username tidak tersedia' });
        }else {
          this.setState({ exist:false, error: '' });
        }
      });
    }else {
      this.setState({ value: '', exist: false, error:this.props.error });
    }
  }
  render() {
    return (
      <div className={this.props.divClass}>
        <small className="text-nowrap">{this.props.title}</small>
        <div className="position-absolute r-1 bg-white radius-20 px-1 text-danger bold f-8 m-0" style={{top:'8px'}}>{this.state.error }</div>
        <input onChange={this.value.bind(this)} value={this.state.value} data-exist={this.state.exist} type="text" name={this.props.name} className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder={this.props.placeholder} />
      </div>
    );
  }
}
export default Username
