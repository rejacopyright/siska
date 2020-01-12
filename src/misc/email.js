import React from 'react';
class Uang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:this.props.value || '',
      isValid:this.props.value
    }
  }
  UNSAFE_componentWillReceiveProps(props) {
    if (props.value) {
      let val = props.value.replace(/\s+/g, '');
      if (val.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        this.setState({ isValid:true });
      }else {
        this.setState({ isValid:false });
      }
      this.setState({ value: val });
    }
  }
  value = (e) => {
    let val = e.target.value.replace(/\s+/g, '');
    if (val.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      this.setState({ isValid:true });
    }else {
      this.setState({ isValid:false });
    }
    this.setState({ value: val });
  }
  render() {
    return (
      <div className={this.props.divClass}>
        <small className="text-nowrap">{this.props.title}</small>
        <div className="position-absolute r-1 bg-white radius-20 px-1 text-danger bold f-8 m-0" style={{top:'8px'}}>{!this.state.isValid ? '*Email tidak valid' : ''}</div>
        <input onChange={this.value.bind(this)} value={this.state.value} type="text" name={this.props.name} data-valid={this.state.isValid} className="form-control form-control-sm radius-5 bg-light" autoComplete="off" placeholder={this.props.placeholder} />
      </div>
    );
  }
}
export default Uang
