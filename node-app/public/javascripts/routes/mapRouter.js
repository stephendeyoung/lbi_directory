define([
	'underscore',
	'backbone',
    'collections/cities',
    'views/cityView'
	], function(_, Backbone, Cities, CityView) {
    var MapRouter = Backbone.Router.extend({

        routes: {
            ':city': 'getCity'
        },

        getCity: function(city) {
            var that = this;
            Cities.get(city.replace('-', ' ')).fetch({
                success: that.cityView
            });
        },

        cityView: function(model, response) {
            $('#mapContainer').trigger('zoom', [model.id]);
        }

    });
    return MapRouter;
});