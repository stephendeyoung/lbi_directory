define([
	'jquery',
	'underscore',
	'backbone',
	'views/staffView',
	'handlebars',
	'text!templates/mapOverlay.handlebars',
	'text!templates/staffList.handlebars'
	], function($, _, Backbone, StaffView, Handlebars, overlayTemplate, staffTemplate) {
	var CityView = Backbone.View.extend({

		el: 'body',

		map: $('#mapContainer'),

		overlayEl: '.mapOverlay',

		staffList: $('#staffList'),

		templateOverlay: Handlebars.compile(overlayTemplate),

		templateStaff: Handlebars.compile(staffTemplate),

		events: {
			'click #zoomOut': function() {
				this.map.trigger('zoom');
			},
			'submit #all': 'initializeStaffList',
			'submit #departments': function(event) {
				event.preventDefault();
				this.initializeStaffList($('#department').val());
			},
			'keyup #filterInput': 'filterStaffList',
			'removeOverlay .mapOverlay': 'removeOverlay'
		},

		overlayWidth: 0,

		initialize: function() {
			this.render(this.map);
		},

		render: function(container) {
			var containerWidth = container.width(),
				containerHeight = $('#worldMap').height();

			container.height(containerHeight);

			this.overlayWidth = containerWidth / 2.5;

			container
				.append(this.templateOverlay(this.model.attributes))
				.find(this.overlayEl)
				.css({
					width: this.overlayWidth,
					height: containerHeight + 13,
					left: -this.overlayWidth
				})
				.animate({
					left: 0,
					opacity: 1
				});
		},

		removeOverlay: function() {
			var that = this;
			$(this.overlayEl)
				.animate({
					left: -this.overlayWidth,
					opacity: 0
				}, function() {
					$(this).remove();
					$('html, body').animate({
						scrollTop: 0
					}, 1000, function() {
						that.staffList.empty();
					});
				});
		},

		initializeStaffList: function(department) {
			this.staffList.empty();
			this.staffList.append(this.templateStaff());
			this.addStaff(department, this.scrollToStaffList);
			return false;
		},

		scrollToStaffList: function() {
			var pos = this.staffList.offset().top;
			$('html, body').animate({
				scrollTop: pos
			}, 500);
		},

		addStaff: function(department, callback) {
			var getDepartment = typeof department !== 'string' ? false : department;
			_.each(this.model.staffCollection.models, function(employee) {
				if (getDepartment) {
					if (employee.get('department') === getDepartment) {
						new StaffView.StaffView({
							model: employee,
							attachTo: '#list'
						});
					}
				} else {
					new StaffView.StaffView({
						model: employee,
						attachTo: '#list'
					});
				}
			});
			callback.call(this);
		},

		filterStaffList: function(e) {
	        var filter = $(e.target).val();
	        var list = $('#list');

	        $.expr[':'].Contains = function(a, i, m) {
	            return (a.textContent || a.innerText || '').toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
	        };

	        if (filter) {
	            var matches = list.find('a:Contains(' + filter + ')').parent();
	            $('li', list).not(matches).hide();
	            matches.show();
	        } else {
	            list.find('li').show();
	        }
	        return false;
	    }
  	});
  	return CityView;
});