import React from 'react';
import $ from 'jquery';
import con from '../api/connection';
import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.min.js';
import '../assets/css/select2.css';
class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value : '',
      error : this.props.selected ? '' : this.props.error
    }
  }
  componentDidMount() {
    const lang = {
      searching: (() => 'Mencari...'),
      noResults: (() => 'Tidak ada data yang ditemukan...'),
      loadingMore: (() => 'Memuat hasil Lainnya...')
    }
    if (this.props.url !== undefined) {
      $("select[name="+this.props.name+"]").select2({
        'placeholder': this.props.placeholder,
        language: lang,
        ajax: {
          headers: con.headers,
          url: con.api+'/'+this.props.url,
          dataType: 'json',
          processResults: function (data, params) {
            params.page = params.page || 1;
            return {
              results: data.map(i => { return {id:i.id,text:i.text} }),
              pagination: {
                more: (params.page) < (data.length + 1)
              }
            };
          },
          cache: false
        }
      });
    }else {
      $("select[name="+this.props.name+"]").select2({
        'placeholder': this.props.placeholder,
        language: lang,
        data:this.props.data
      });
    }
    const t = this;
    $("select[name="+this.props.name+"]").on('change', function(e){
      t.setState({ value: $(this).val(), error:'' }, t.props.onChange !== undefined ? () => t.props.onChange($(this).val()) : () => false);
    });
  }
  render() {
    return (
      <div className={this.props.className}>
        <small className="text-nowrap">{this.props.title}</small>
        <div className="position-absolute r-1 text-danger bold f-8 m-0 z-9 bg-white px-1" style={{top:'8px'}}>{this.state.error }</div>
        <select name={this.props.name} style={{width:100+'%'}} disabled={this.props.disabled} ref={i => this.select = i} >
          {
            this.props.selected && <option value={this.props.selected[0]}>{this.props.selected[1]}</option>
          }
        </select>
      </div>
    );
  }
}
export default Select
