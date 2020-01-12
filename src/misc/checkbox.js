import React from 'react';
class Radio extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      checked:this.props.checked,
      value:this.props.value
    }
  }
  change(){
    this.setState({ checked:this.state.checked !== true });
  }
  render() {
    return (
      <React.Fragment>
        <span className={`material-switch ${this.props.className}`}>
          <input id={this.props.name} name={this.props.name} onChange={this.change.bind(this)} value={this.props.value} type="checkbox" defaultChecked={this.props.checked} />
          <label htmlFor={this.props.name} className="bg-primary text-nowrap"></label>
        </span>
        <label htmlFor={this.props.name} className="pointer f-10 bold m-0">{this.props.title}</label>
      </React.Fragment>
    );
  }
}
export default Radio;
