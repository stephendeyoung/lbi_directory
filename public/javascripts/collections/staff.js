define([
	'underscore',
	'backbone',
	'models/employee'
	], function(_, Backbone, Employee){

	var StaffCollection = Backbone.Collection.extend({

		model: Employee,

		url: '/countryData/',

		initialize: function(models, city) {
			var deferred = $.Deferred();
			deferred.done(function() {
				console.log('data loaded')
			});
			this.url += city + '/staff';
			this.fetch({
				success: function() {
					deferred.resolve();
				}
			});
		},

		parse: function(response) {
			return response.staff;
		}

	});
	return StaffCollection;
});