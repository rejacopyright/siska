import React from 'react';
import axios from 'axios';
import con from '../api/connection';
class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      value:this.props.value || '',
      error:this.props.value ? '' : this.props.error
    }
  }
  UNSAFE_componentWillReceiveProps(props) {
    if (props.value) {
      let value = props.value;
      this.setState({ value:value, error:'' });
    }
  }
  search = (e) => {
    this.setState({ value:e.target.value });
    e.target.value ? this.setState({error:''}) : this.setState({error: this.props.error});
    axios.get(con.api+'/'+this.props.api,{headers:con.headers,params:{q:e.target.value,}}).then((res) => {
      if (res.config.params.q) {
        this.setState({ data:res.data });
      }else {
        this.setState({ data:[] });
      }
    });
  }
  dataClick = (e) => {
    this.setState({
      value:e.target.innerText,
      data:[]
    });
  }
  render() {
    const Data = () => {
      if (this.state.data.length) {
        return (
          <div className="bg-white no-b shadow radius-0 py-2 position-absolute radius-10 z-99 w-100">
            {
              this.state.data.map((val, i) => (
                <p className="m-0 px-3 py-2 autocomplete pointer place hover" key={i} onClick={this.dataClick.bind(this)}>
                  <i className="la la-map-marker mr-2" />
                  {Object.values(val).join(', ')}
                </p>
              ))
            }
          </div>
        )
      }else {
        return <React.Fragment />
      }
    }
    return (
      <div className={this.props.divClass}>
        <small className="text-nowrap">{this.props.title}</small>
        <div className="position-absolute r-1 bg-white radius-20 px-1 text-danger bold f-8 m-0 z-9" style={{top:'8px'}}>{ this.state.error }</div>
        <div className="form-group has-icon m-0">
          <i className="la la-search" />
          <input name={this.props.name} value={this.state.value} onChange={this.search.bind(this)} className="form-control form-control-sm bg-light radius-5 search" placeholder={this.props.placeholder} type="text" autoComplete="off" />
          <span className="la la-times icon-password position-absolute t-0 r-0 mt-1 mr-1 bg-dark opacity-1 text-white p-1 radius-20 clear" style={{display: 'none'}} />
        </div>
        <Data />
      </div>
    );
  }
}
export default Autocomplete
