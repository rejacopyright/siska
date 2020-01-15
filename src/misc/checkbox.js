import React from 'react';
function generate(){
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
class Radio extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      checked:this.props.checked,
      value:this.props.value,
      uniq:generate()
    }
  }
  change(){
    this.setState({ checked:this.state.checked !== true });
  }
  render() {
    return (
      <div className={this.props.divClass}>
        {this.props.rtl && <label htmlFor={this.props.id || this.state.uniq} className="pointer f-10 bold mr-3">{this.props.title}</label>}
        <span className={`material-switch ${this.props.className}`}>
          <input id={this.props.id || this.state.uniq} name={this.props.name} onChange={this.change.bind(this)} value={this.props.value} type="checkbox" defaultChecked={this.props.checked} />
          <label htmlFor={this.props.id || this.state.uniq} className="bg-primary text-nowrap"></label>
        </span>
        {!this.props.rtl && <label htmlFor={this.props.name} className="pointer f-10 bold m-0">{this.props.title}</label>}
      </div>
    );
  }
}
export default Radio;
