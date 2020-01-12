import $ from 'jquery';
// PREPEND
$(document).on('mouseover', ".reja-input-icon .form-control", function(e) {
  if ($(e.target).is(':focus') === false) {
    $(e.target).parent().find(":first").css({'border':'1px solid #ff4484', 'color':'#ff4484'});
    $(e.target).css({'background':'rgba(255, 172, 200, 0.1)', 'border-color':'#ff4484'});
  }
});
$(document).on('mousedown', ".reja-input-icon .form-control",function(e) {
  $(e.target).parent().find(":first").css({'border':'1px dashed #bbb', 'color':'#aaa'});
  $(e.target).css({'background':'none'});
});
$(document).on('mouseleave', ".reja-input-icon .form-control", function(e) {
  if ($(e.target).val() !== "") {
    $(e.target).parent().find(":first").css({'border':'1px solid #ff4484', 'color':'#ff4484'});
    $(e.target).css({'background':'none', 'border-color':'#ff4484'});
  }else {
    $(e.target).parent().find(":first").css({'border':'1px dashed #bbb', 'color':'#aaa'});
    $(e.target).css({'background':'none', 'border-color':'rgba(0,0,0,0.1)'});
  }
});
$(document).on("blur", ".reja-input-icon .form-control", function(e) {
  if ($(e.target).val() !== "") {
    $(e.target).parent().find(":first").css({'border':'1px solid #ff4484', 'color':'#ff4484'});
    $(e.target).css({'border-color':'#ff4484'});
  }else {
    $(e.target).parent().find(":first").css({'border':'1px dashed #bbb', 'color':'#aaa'});
    $(e.target).css({'border-color':'rgba(0,0,0,0.1)'});
  }
});
// APPEND
$(document).on('mouseover', ".reja-input-icon-append .form-control", function(e) {
  if ($(e.target).is(':focus') === false) {
    $(e.target).parent().find(":last").css({'border':'1px solid #ff4484', 'color':'#ff4484'});
    $(e.target).css({'background':'rgba(255, 172, 200, 0.1)', 'border-color':'#ff4484'});
  }
});
$(document).on('mousedown', ".reja-input-icon-append .form-control",function(e) {
  $(e.target).parent().find(":last").css({'border':'1px dashed #bbb', 'color':'#aaa'});
  $(e.target).css({'background':'none'});
});
$(document).on('mouseleave', ".reja-input-icon-append .form-control", function(e) {
  if ($(e.target).val() !== "") {
    $(e.target).parent().find(":last").css({'border':'1px solid #ff4484', 'color':'#ff4484'});
    $(e.target).css({'background':'none', 'border-color':'#ff4484'});
  }else {
    $(e.target).parent().find(":last").css({'border':'1px dashed #bbb', 'color':'#aaa'});
    $(e.target).css({'background':'none', 'border-color':'rgba(0,0,0,0.1)'});
  }
});
$(document).on("blur", ".reja-input-icon-append .form-control", function(e) {
  if ($(e.target).val() !== "") {
    $(e.target).parent().find(":last").css({'border':'1px solid #ff4484', 'color':'#ff4484'});
    $(e.target).css({'border-color':'#ff4484'});
  }else {
    $(e.target).parent().find(":last").css({'border':'1px dashed #bbb', 'color':'#aaa'});
    $(e.target).css({'border-color':'rgba(0,0,0,0.1)'});
  }
});
