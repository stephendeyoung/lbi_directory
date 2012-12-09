define([
	'underscore',
	'backbone',
	'models/city'
	], function(_, Backbone, City){

	var CityCollection = Backbone.Collection.extend({

		// Reference to this collection's model.
		model: City,

		url: '/countryData/cities',

		initialize: function() {
		},

		parse: function(response) {
			return response.data;
		}

	});
	return new CityCollection;
});