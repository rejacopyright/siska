import React from 'react';
export default class Modal extends React.Component {
  render() {
    return (
      <div className="modal fade" id={this.props.id} role="dialog">
        <div className={"modal-dialog d-flex align-items-center min-vh-90 modal-"+ this.props.size} >
          <div className="modal-content shadow no-b">
            <div className="modal-header py-2 bg-light">
              <h6 className="modal-title text-info"> {this.props.title} </h6>
              <span data-dismiss="modal"> <i className="text-dark la la-times f-14 pointer" /> </span>
            </div>
            <div className={"modal-body no-b "+ (this.props.bodyClass || 'py-2')}>
              {this.props.body}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
