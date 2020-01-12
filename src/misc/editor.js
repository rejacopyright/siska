import React from 'react';
import JoditEditor from "jodit-react";
class Editor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      error: this.props.value ? '' : this.props.error,
      optFull: ['|', 'source', '|', 'bold', 'strikethrough', 'underline', 'italic', '|', 'superscript', 'subscript', '|', 'ul', 'ol', '|', 'outdent', 'indent', '|', 'font', 'fontsize', 'brush', 'paragraph', '|', 'image', 'file', 'video', 'table', 'link', '|', 'align', 'undo', 'redo', '\n', '|', 'selectall', 'cut', 'copy', 'paste', 'eraser', 'copyformat', '|', 'hr', 'symbol', 'fullsize', 'print', '|' ],
      optMin: [ 'bold', 'italic', 'ul', 'ol', 'undo', 'redo' ]
    }
  }
  change(e){
    let length = e.replace(/<\/?[^>]+>/ig, "").length;
    if (this.props.error) {
      if (length) {
        this.error.innerText = '';
      }else {
        this.error.innerText = this.props.error || '';
      }
    }
  }
  render() {
    const config = {
      uploader: {
        "insertImageAsBase64URI": true
      },
      useAceEditor: false,
      beautifyHTML: false,
      showCharsCounter: true,
      showWordsCounter: false,
      toolbarDisableStickyForMobile:false,
      toolbarButtonSize: "small",
      // toolbarSticky:true,
      // toolbarStickyOffset:50,
      zIndex:999,
      placeholder: this.props.placeholder || 'Mulai menulis',
      minHeight: this.props.minHeight || 200,
      showTooltipDelay:1,
      iframe:false,
      spellcheck:false,
      language:'id',
      buttons:this.props.optMin ? this.state.optMin : this.state.optFull,
      buttonsMD:this.props.optMin ? this.state.optMin : this.state.optFull,
      buttonsSM:this.props.optMin ? this.state.optMin : this.state.optFull,
      buttonsXS:this.props.optMin ? this.state.optMin : this.state.optFull,
      addNewLineOnDBLClick:false,
      enter:'br'
    }
    return (
      <div className={this.props.divClass}>
        <div className={this.props.className}>
          <small>
            {this.props.title}
            {
              (this.props.title && this.props.error) ?
              <p className="text-danger bold f-8 d-inline ml-2 mb-0 lh-2" ref={i => this.error = i}>{this.props.value ? '' : this.state.error}</p>
              : ''
            }
          </small>
          <JoditEditor onChange={this.change.bind(this)} value={this.props.value} config={config} ref={i => this.editor = i} />
        </div>
      </div>
    );
  }
}
export default Editor
