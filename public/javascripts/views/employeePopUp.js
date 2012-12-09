define([
	'jquery',
	'underscore',
	'backbone',
	'views/staffView',
	'exports',
	'handlebars',
	'text!templates/employeePopUp.handlebars'
	], function($, _, Backbone, StaffView, exports, Handlebars, Template) {

		var EmployeePopUp = Backbone.View.extend({

			el: 'body',

			popUp: '.popUp',

			mask: $('#olMask'),

			template: Handlebars.compile(Template),

			events: {
				'click .close': 'removePopUp',
				'keyup': 'removePopUp'
			},

			initialize: function() {
				var that = this;

				$(that.popUp).remove();

				if (!that.model.has('manages')) {
					var manages = _.filter(that.model.collection.models, function(employee) {
						if (employee.get('manager') === that.model.get('givenName') + ' ' + that.model.get('sn')) {
							return employee;
						}
					});
					that.model.set({
						manages: manages
					});
				}
				that.render();
			},

			render: function() {
				this.$el.append(this.template(this.model.attributes));
				this.mask.show();
				this.createSubordinates();
				return this;
			},

			createSubordinates: function() {
				_.each(this.model.get('manages'), function(employee) {
					return new StaffView.StaffView({
						model: employee,
						attachTo: '.reportTo'
					});
				});
			},

			removePopUp: function(event) {
				if (event.type === 'click' || event.keyCode === 27) {
					$(this.popUp).remove();
					this.mask.hide();
				}
			}
	  	});

	// We have to use exports so that we can make a circular reference (EmployeePopUp // requires StaffView and StaffView requires EmployeePopUp)

  	exports.EmployeePopUp = EmployeePopUp;

});


