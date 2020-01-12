import React from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
// import '../assets/plugins/cropper/cropper.css';
class Crop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:''
    }
  }
  cropper(img){
    const t = this;
    new Cropper(img, {
      aspectRatio: 1 / 1,
      viewMode: 2,
      dragMode: 'move',
      background: false,
      modal: false,
      // zoomOnWheel: false,
      toggleDragModeOnDblclick: false,
      wheelZoomRatio: 1,
      autoCropArea: 1,
      // scalable: false,
      crop(e) {
        t.setState({
          data: this.cropper.getCroppedCanvas().toDataURL()
        });
        t.props.onCrop(this.cropper.getCroppedCanvas().toDataURL());
        // console.log(e.detail.x);
        // console.log(e.detail.y);
        // console.log(e.detail.width);
        // console.log(e.detail.height);
        // console.log(e.detail.rotate);
        // console.log(e.detail.scaleX);
        // console.log(e.detail.scaleY);
      },
    });

  }
  componentDidMount() {
    this.cropper(this.img);
  }
  render() {
    return (
      <div>
        <img ref={i => this.img = i} src={this.props.src+(this.props.time ? '?timestamp='+new Date().getTime() : '')} alt="img" />
      </div>
    );
  }
}
export default Crop
