define([
	'jquery',
	'underscore',
	'backbone',
	'views/employeePopUp',
	'exports',
	'handlebars',
	'text!templates/staffListItem.handlebars'
	], function($, _, Backbone, EmployeePopUp, exports, Handlebars, Template) {

	var StaffView = Backbone.View.extend({

		tagName: 'li',

		className: 'card',

		template: Handlebars.compile(Template),

		events: {
			'click .card a': 'showPopUp'
		},

		initialize: function(options) {
			this.render(options.attachTo);
		},

		render: function(el) {
			this.$el.html(this.template(this.model.attributes)).appendTo(el);
			return this;
		},

		showPopUp: function() {
			return new EmployeePopUp.EmployeePopUp({
				model: this.model
			});
		}
  	});

  	// We have to use exports so that we can make a circular reference (EmployeePopUp // requires staffView and StaffView requires EmployeePopUp)

  	exports.StaffView = StaffView;
});

