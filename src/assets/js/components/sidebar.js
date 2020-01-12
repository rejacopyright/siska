function _init() {
	"use strict";
	var e = $(".slimScroll");
	e.length && e.each(function() {
		var e = $(this),
			a = e.data();
		e.slimscroll({
			height: a.height ? a.height + "px" : $(window).height() - 0 + "px",
			color: a.color ? a.color : "rgba(0,0,0,0.95)",
			size: a.size ? a.size + "px" : "5px"
		})
	}), $.PaperPanel.layout = {
		activate: function() {
			var e = this;
			e.fix(), e.fixSidebar(), $(window, ".wrapper").on("resize", function() {
				e.fix(), e.fixSidebar()
			})
		},
		fix: function() {
			var e = $(".main-header").outerHeight() + $(".main-footer").outerHeight(),
				a = $(window).height(),
				s = $(".sidebar").height();
			if ($("body").hasClass("fixed")) $(".content-wrapper, .right-side").css("min-height", a - $(".main-footer").outerHeight());
			else {
				var i;
				i = s <= a ? ($(".content-wrapper, .right-side").css("min-height", a - e), a - e) : ($(".content-wrapper, .right-side").css("min-height", s), s);
				var o = $($.PaperPanel.options.controlSidebarOptions.selector);
				void 0 !== o && o.height() > i && $(".content-wrapper, .right-side").css("min-height", o.height())
			}
		},
		fixSidebar: function() {
			$(".main-sidebar").hasClass("fixed") ? (void 0 === $.fn.slimScroll && window.console && window.console.error("Error: the fixed layout requires the slimscroll plugin!"), $.PaperPanel.options.sidebarSlimScroll && void 0 !== $.fn.slimScroll && ($(".sidebar").slimScroll({
				destroy: !0
			}).height("auto"), $(".sidebar").slimscroll({
				height: $(window).height() + "px",
				color: "rgba(0,0,0,0.3)",
				size: "5px"
			}))) : void 0 !== $.fn.slimScroll && $(".sidebar").slimScroll({
				destroy: !0
			}).height("auto")
		}
	}, $.PaperPanel.pushMenu = {
		activate: function(e) {
			var a = $.PaperPanel.options.screenSizes;
			$(".sidebar-offcanvas-desktop").length && ($("body").addClass("sidebar-collapse"), $(".sidebar-offcanvas-desktop").show()), $(document).on("click", e, function(e) {
				e.preventDefault(), e.stopPropagation(), $(window).width() > a.md - 1 ? $("body").hasClass("sidebar-collapse") ? ($(".offcanvas").parent().removeClass("sidebar-collapse"), $("body").removeClass("sidebar-collapse").trigger("expanded.pushMenu"), $(".sidebar-offcanvas-desktop").length && $("body").addClass("sidebar-open").trigger("expanded.pushMenu")) : $("body").addClass("sidebar-collapse").trigger("collapsed.pushMenu") : $("body").hasClass("sidebar-open") ? $("body").removeClass("sidebar-open").removeClass("sidebar-collapse").trigger("collapsed.pushMenu") : $("body").addClass("sidebar-open").trigger("expanded.pushMenu")
			}), $(".page").on("click", function() {
				$(window).width() <= a.md - 1 && $("body").hasClass("sidebar-open") && $("body").removeClass("sidebar-open")
			}), $("#app").on("click", function(e) {
				$(e.target).closest(".control-sidebar").length || $(".control-sidebar").hasClass("control-sidebar-open") && $(".control-sidebar").removeClass("control-sidebar-open"), $(e.target).closest(".main-sidebar").length || $(".sidebar-offcanvas-desktop").length && ($("body").removeClass("sidebar-open").removeClass("sidebar-collapse").trigger("collapsed.pushMenu"), $("body").addClass("sidebar-collapse").trigger("collapsed.pushMenu"))
			})
		},
		expandOnHover: function() {
			var e = this,
				a = $.PaperPanel.options.screenSizes.sm - 1;
			$(".main-sidebar").on("hover", function() {
				$("body").hasClass("sidebar-mini") && $("body").hasClass("sidebar-collapse") && $(window).width() > a && e.expand()
			}, function() {
				$("body").hasClass("sidebar-mini") && $("body").hasClass("sidebar-expanded-on-hover") && $(window).width() > a && e.collapse()
			})
		},
		expand: function() {
			$("body").removeClass("sidebar-collapse").addClass("sidebar-expanded-on-hover")
		},
		collapse: function() {
			$("body").hasClass("sidebar-expanded-on-hover") && $("body").removeClass("sidebar-expanded-on-hover").addClass("sidebar-collapse")
		}
	}, $.PaperPanel.tree = function(e) {
		var n = this,
			r = $.PaperPanel.options.animationSpeed;
		$(document).on("click", e + " li a", function(e) {
			var a = $(this),
				s = a.next();
			if (s.is(".treeview-menu") && s.is(":visible") && !$("body").hasClass("sidebar-collapse")) s.slideUp(r, function() {
				s.removeClass("menu-open")
			}), s.parent("li").removeClass("active");
			else if (s.is(".treeview-menu") && !s.is(":visible")) {
				var i = a.parents("ul").first();
				i.find("ul:visible").slideUp(r).removeClass("menu-open");
				var o = a.parent("li");
				s.slideDown(r, function() {
					s.addClass("menu-open"), i.find("li.active").removeClass("active"), o.addClass("active"), n.layout.fix()
				})
			}
			s.is(".treeview-menu") && e.preventDefault()
		})
	}
}
$(function() {
	"use strict";
	$.PaperPanel = {}, $.PaperPanel.options = {
		animationSpeed: 500,
		sidebarToggleSelector: "[data-toggle='offcanvas']",
		sidebarPushMenu: !0,
		navbarMenuSlimscrollWidth: "3px",
		sidebarSlimScroll: !0,
		controlSidebarOptions: {
			toggleBtnSelector: "[data-toggle='control-sidebar']",
			selector: ".control-sidebar",
			slide: !0
		},
		screenSizes: {
			xs: 480,
			sm: 768,
			md: 1025,
			lg: 1200
		}
	}, $("body").removeClass("hold-transition"), "undefined" != typeof PaperPanelOptions && $.extend(!0, $.PaperPanel.options, PaperPanelOptions);
	var e = $.PaperPanel.options;
	_init(), $.PaperPanel.layout.activate(), $.PaperPanel.tree(".sidebar"), e.enableControlSidebar && $.PaperPanel.controlSidebar.activate(), e.sidebarPushMenu && $.PaperPanel.pushMenu.activate(e.sidebarToggleSelector), $('.btn-group[data-toggle="btn-toggle"]').each(function() {
		var a = $(this);
		$(this).find(".btn").on("click", function(e) {
			a.find(".btn.active").removeClass("active"), $(this).addClass("active"), e.preventDefault()
		})
	})
});
