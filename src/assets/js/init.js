import $ from 'jquery';
// $(document).on('click', '.toggle-canvas', function(e){
//   $('.pp-nav-toggles').find('i').toggleClass("la-arrow-left la-arrow-right");
// });
$(document).on("click", ".page", function(e) {
  if ($("body").hasClass("sidebar-open") && $(e.target).hasClass('toggle-side') === false) {
    $("body").removeClass("sidebar-open");
  }
})
$(document).ready(function(){
  $('.sidebar-menu li:not(.treeview) a[href="'+window.location.pathname+'"]').addClass('active').closest('.collapse').addClass('show').prev().find('.toggle-1').addClass('rotate-1 top-10');
  var a = $('.sidebar-menu ul.treeview-menu li a[href="'+window.location.pathname+'"]');
  a.addClass('active');
  var s = a.closest('.treeview-menu');
  s.slideDown(100, function() {
    s.addClass("menu-open");
    s.closest('li.treeview').addClass('active');
    a.parent('li').addClass("active");
  });
});
$(document).on('click', '.toggle-canvas', function(e){
  $("body").toggleClass("sidebar-collapse sidebar-open");
});
$(document).on('click', 'ul.sidebar-menu li a', function(e){
  $('ul.sidebar-menu li a').removeClass('active');
  $(this).addClass('active');
});
$(document).on("click", '.sidebar-menu li > a', function(e) {
  var a = $(this), s = a.next();
  var x = (a.closest('ul').hasClass('treeview-menu') || a.closest('li').hasClass('treeview')) === false;
  if (s.is(".treeview-menu") && s.is(":visible") && !$("body").hasClass("sidebar-collapse")){
    s.slideUp(100, function() {
      s.removeClass("menu-open");
      s.parent("li").removeClass("active");
    });
  }else if (s.is(".treeview-menu") && !s.is(":visible")) {
    var i = a.parents("ul").first();
    i.find("ul:visible").slideUp(100).removeClass("menu-open");
    var o = a.parent("li");
    s.slideDown(100, function() {
      s.addClass("menu-open");
      i.find("li.active").removeClass("active");
      o.addClass("active");
    });
  }else if (x) {
    var t = $('li > a').next();
    t.slideUp(100, function() {
      t.removeClass("menu-open");
      t.parent("li").removeClass("active");
    });
  }
});

// TOGGLE
$(document).on('click', '.sidebar-title', function(e){
  $(e.currentTarget).find('.toggle-1').toggleClass('rotate-1 top-10')
});

// POPPER
$(document).on('mouseenter', '[data-toggle="popover"]', function(e){
  var t = $(e.target);
  $(t).popover('show');
});
