import React from 'react';
class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:this.props.value || '',
      error:this.props.value ? '' : this.props.error
    }
  }
  UNSAFE_componentWillReceiveProps(props) {
    if (props.value) {
      let value = props.value;
      if (props.space) {
        value = value.replace(/\s+/g, '');
      }
      if (props.capital) {
        value = value.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
      }
      this.setState({ value:value, error: '' });
    }
  }
  value = (e) => {
    if (e.target.value) {
      this.setState({ error:''});
    }else {
      this.setState({ error:this.props.error });
    }
    let value = e.target.value;
    if (this.props.space) {
      value = value.replace(/\s+/g, '');
    }
    if (this.props.capital) {
      value = value.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
    }
    this.setState({ value:value });
  }
  render() {
    return (
      <div className={this.props.divClass}>
        <small className="text-nowrap">{this.props.title}</small>
        <div className="position-absolute r-1 bg-white radius-20 px-1 text-danger bold f-8 m-0" style={{top:'8px'}}>{ this.state.error }</div>
        <input onChange={this.value.bind(this)} value={this.state.value} type="text" name={this.props.name} className={"form-control form-control-sm radius-5 bg-light " + this.props.className} autoComplete="off" spellCheck={false} placeholder={this.props.placeholder} readOnly={this.props.readOnly} />
        <sup className="text-success f-8">{this.props.note}</sup>
      </div>
    );
  }
}
export default Input
