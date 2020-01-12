import React from 'react';
import '../assets/css/notif.scss';
class Notif extends React.Component {
  constructor(props) {
    super(props);
    this.state = { duration:this.props.duration, percent:this.props.duration / 100 }
    this.style = () => {
      const position = [];
      const transition = [];
      if (this.props.v === 'top') {
        position.push('align-items-start');
        transition.push('notif-top');
      }else if (this.props.v === 'center') {
        position.push('align-items-center');
        transition.push('notif-top');
      }else if (this.props.v === 'bottom') {
        position.push('align-items-end');
        transition.push('notif-bottom');
      }else {
        position.push('align-items-end');
        transition.push('notif-bottom');
      }
      if (this.props.h === 'left') {
        position.push('justify-content-start');
      }else if (this.props.h === 'center') {
        position.push('justify-content-center');
      }else if (this.props.h === 'right') {
        position.push('justify-content-end');
      }else {
        position.push('justify-content-center');
      }
      return {
        position:position.join(' '),
        transition: transition.join(' ')
      }
    }
  }
  clear(){
    this.setState({ duration:this.props.duration });
    clearInterval(this.intervalNotif);
    clearTimeout(this.timeNotif);
  }
  componentDidMount() {
    document.querySelector('.notif-show').addEventListener('click', () => this.show());
    document.querySelector('.notif-close').addEventListener('click', () => this.hide());
  }
  componentWillUnmount() {
    this.clear();
  }
  show() {
    this.notif.classList.add('notif--visible');
    this.clear();
    this.intervalNotif = setInterval(() => {
      this.setState({ duration: (this.state.duration - 10)});
    }, 10);
    this.timeNotif = setTimeout(() => {
      this.hide();
    }, this.props.duration);
  }
  hide() {
    this.notif.classList.remove('notif--visible');
    if (this.props.goBack) {
      window.history.back();
      this.clear();
    }
    this.clear();
  }
  render() {
    return (
      <div className={`position-absolute d-flex ${this.style().position} h-full w-full`}>
        <div className={`notif oh bg-${this.props.bg} ${this.style().transition}`} ref={i => this.notif = i}>
          <div className="row align-items-center">
            <div className="col text-left"> {this.props.message} </div>
            <div className="col-auto text-right pointer">
              <input type="hidden" className="notif-show" />
              <i className="la la-times la-lg notif-close" />
            </div>
          </div>
          <div className="border-bottom border-3 border-white position-absolute l-0 b-0" style={{width:(this.state.duration / this.state.percent)+'%'}}></div>
        </div>
      </div>
    );
  }
}

export default Notif;
