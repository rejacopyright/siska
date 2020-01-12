import React from 'react';
class Password extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:'',
      message:this.props.error,
      accept:false
    }
  }
  value = (e) => {
    let val = e.target.value.replace(/\s+/g, '');
    if (val.length === 0) {
      this.setState({ message:this.props.error, accept:false });
    }else if (this.props.length && val.length < parseInt(this.props.length)) {
      this.setState({ message:'Minimal '+ this.props.length + ' karakter', accept:false });
    }else if (this.props.capital && !e.target.value.match(/[A-Z]/)) {
      this.setState({ message:'Harus mengandung huruf besar', accept:false });
    }else if (this.props.number && !e.target.value.match(/[0-9]/)) {
      this.setState({ message:'Harus mengandung angka', accept:false });
    }else {
      this.setState({ message:'', accept:true });
    }
    this.setState({ value:e.target.value.replace(/\s+/g, '') });
  }
  view(e){
    const input = e.currentTarget.previousSibling;
    const eye = e.currentTarget.querySelector('i.la').classList;
    if (eye.contains('la-eye-slash')) {
      eye.remove('la-eye-slash');
      eye.add('la-eye');
      input.setAttribute('type', 'text');
    }else {
      eye.remove('la-eye');
      eye.add('la-eye-slash');
      input.setAttribute('type', 'password');
    }
  }
  render() {
    return (
      <div className={this.props.divClass}>
        <small className="text-nowrap">{this.props.title}</small>
        <div className="position-absolute r-1 bg-white radius-20 px-1 text-danger bold f-8 m-0" style={{top:'8px'}}>{this.state.message ? '*'+this.state.message : '' }</div>
        <input onChange={this.value.bind(this)} value={this.state.value} type="password" data-accept={this.state.accept} name={this.props.name} className={`form-control form-control-sm radius-5 bg-light ${(this.props.className || '')}`} autoComplete="off" placeholder={this.props.placeholder} />
        <div className="position-absolute radius-20 btn-fab btn-fab-xs shadow-none pb-4 px-1" style={{bottom:'3px', right:'20px'}} onClick={this.view.bind(this)}><i className="la f-16 la-eye-slash text-dark"></i></div>
      </div>
    );
  }
}
export default Password
