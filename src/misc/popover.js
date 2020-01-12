import React from 'react';
class Popover extends React.Component {
  constructor(props) {
    super(props);
    this.truncate = (words, length) => {
      const dot = (length >= words.split(/\W|\//i).length) ? '' : '...';
      return words.split(/\W|\//i).splice(0,length).join(" ") + dot;
    }
  }
  render() {
    return (
      <React.Fragment>
        {
          this.props.content && this.props.content.split(' ').length > (this.props.length || 3) ?
          <span className={`cursor ${this.props.className}`} data-toggle="popover" data-placement="top" data-trigger="hover" title={this.props.title} data-content={this.props.content}>
            { this.props.text || this.truncate(this.props.content, this.props.length || 3) || '-' }
          </span>
          :
          <span>{this.props.content || '-'}</span>
        }
      </React.Fragment>
    );
  }
}

export default Popover
