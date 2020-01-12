import React from 'react';
function generate(){
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
class Radio extends React.Component {
  render() {
    return (
      <div className={`row ${this.props.divClass || ''}`}>
        {
          Object.keys(this.props.setOption).map(index => {
            const g = generate();
            return (
              <div className="col-auto" key={index}>
                <p className="bold f-9 text-capitalize">{this.props.setOption[index]}</p>
                <div className="material-switch">
                  <input id={g} name={this.props.name} value={index} type="radio" defaultChecked={this.props.checked === parseInt(index)} />
                  <label htmlFor={g} className="bg-primary text-nowrap"></label>
                </div>
              </div>
            )
          }
        )
      }
    </div>
    );
  }
}
export default Radio;
