$(function(){
  var console = window.console || { log: function () {} };
  var URL = window.URL || window.webkitURL;
  var $image = $('#image');
  var $download = $('#download');
  var $dataX = $('#dataX');
  var $dataY = $('#dataY');
  var $dataHeight = $('#dataHeight');
  var $dataWidth = $('#dataWidth');
  var $dataRotate = $('#dataRotate');
  var $dataScaleX = $('#dataScaleX');
  var $dataScaleY = $('#dataScaleY');
  var options = {
    aspectRatio: 1 / 1,
    viewMode: 2,
    dragMode: 'move',
    // movable: false,
    background: false,
    modal: false,
    // zoomable: false,
    // zoomOnTouch: false,
    zoomOnWheel: false,
    toggleDragModeOnDblclick: false,
    wheelZoomRatio: 1,
    autoCropArea: 1,
    scalable: false,
    preview: '.img-preview',
    canvas: {width:100,height:100},
    crop: function (e) { $dataX.val(Math.round(e.detail.x)); $dataY.val(Math.round(e.detail.y)); $dataHeight.val(Math.round(e.detail.height)); $dataWidth.val(Math.round(e.detail.width)); $dataRotate.val(e.detail.rotate); $dataScaleX.val(e.detail.scaleX); $dataScaleY.val(e.detail.scaleY); }
  };
  var originalImageURL = $image.attr('src');
  var uploadedImageName = 'cropped.jpg';
  var uploadedImageType = 'image/jpeg';
  var uploadedImageURL;
  $image.cropper(options);
  // Methods
  $('.docs-buttons').on('click', '[data-method]', function () {
    var $this = $(this);
    var data = $this.data();
    var cropper = $image.data('cropper');
    var cropped;
    var $target;
    var result;
    if ($this.prop('disabled') || $this.hasClass('disabled')) { return; }
    if (cropper && data.method) {
      data = $.extend({}, data); // Clone a new one
      if (typeof data.target !== 'undefined') { $target = $(data.target); if (typeof data.option === 'undefined') { try { data.option = JSON.parse($target.val()); } catch (e) { console.log(e.message); } } }
      cropped = cropper.cropped;
      switch (data.method) { case 'rotate': if (cropped && options.viewMode > 0) { $image.cropper('clear'); } break; case 'getCroppedCanvas': if (uploadedImageType === 'image/jpeg') { if (!data.option) { data.option = {}; } data.option.fillColor = '#fff'; } break; }
      result = $image.cropper(data.method, data.option, data.secondOption);
      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) { $image.cropper('crop'); }
          break;
        case 'scaleX':
        case 'scaleY':
          $(this).data('option', -data.option);
          break;
        case 'getCroppedCanvas':
          if (result) { $('#getCroppedCanvasModal').modal().find('.modal-body').html(result); if (!$download.hasClass('disabled')) { download.download = uploadedImageName; $download.attr('href', result.toDataURL(uploadedImageType)); } }
          break;
        case 'destroy':
          if (uploadedImageURL) { URL.revokeObjectURL(uploadedImageURL); uploadedImageURL = ''; $image.attr('src', originalImageURL); }
          break;
      }
      if ($.isPlainObject(result) && $target) { try { $target.val(JSON.stringify(result)); } catch (e) { console.log(e.message); } }
    }
  });
  // Import image
  var $inputImage = $('#inputImage');
  if (URL) {
    $inputImage.change(function () {
      var files = this.files;
      var file;
      if (!$image.data('cropper')) { return; }
      if (files && files.length) { file = files[0]; if (/^image\/\w+$/.test(file.type)) { uploadedImageName = file.name; uploadedImageType = file.type; if (uploadedImageURL) { URL.revokeObjectURL(uploadedImageURL); } uploadedImageURL = URL.createObjectURL(file); $image.cropper('destroy').attr('src', uploadedImageURL).cropper(options); $inputImage.val(''); } else { window.alert('Please choose an image file.'); } }
    });
  } else {
    $inputImage.prop('disabled', true).parent().addClass('disabled');
  }
});
