import React from 'react';
class Uang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:this.props.value || '',
      error:this.props.value ? '' : this.props.error
    }
  }
  UNSAFE_componentWillReceiveProps(props) {
    if (props.value) {
      this.setState({ value: props.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') });
    }
  }
  value = (e) => {
    !e.target.value ? this.setState({ error:this.props.error }) : this.setState({ error:'' });
    let val = e.target.value.replace(/[^0-9]+/g, "");
    if (val.length > 1 && val.split('')[0] === '0') {
      val = val.substr(1);
    }
    this.setState({ value: val.split('.').join('').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') });
  }
  render() {
    return (
      <div className={this.props.divClass}>
        <small className="text-nowrap">{this.props.title}</small>
        <div className="position-absolute r-1 bg-white radius-20 px-1 text-danger bold f-8 m-0" style={{top:'8px'}}>{ this.state.error }</div>
          <div className={`form-group ${this.props.right ? 'has-right-icon' : 'has-icon'} m-0`}>
            {
              this.props.icon ?
              <i className={`la la-${this.props.icon}`} />
              : this.props.iconText ?
              <span>{this.props.iconText}</span>
              : <i className='la la-search' />
            }
            <input onChange={this.value.bind(this)} value={this.state.value} type="text" name={this.props.name} className="form-control form-control-sm radius-5 bg-light" autoComplete="off" />
          </div>
        <sup className="text-success f-8">{this.props.note}</sup>
      </div>
    );
  }
}
export default Uang
