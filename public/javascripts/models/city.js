define([
	'jquery',
	'underscore',
	'backbone',
    'collections/staff'
	], function($, _, Backbone, Staff) {
    var CityModel = Backbone.Model.extend({

        idAttribute: "NAME",

        initialize: function() {
            this.set({
        		centroid: $('#' + this.attributes.ADM0_A3).data('centroid')
        	});
            this.getStaff();
            this.fetch({
                success: function() {
                }
            });
        },

        getStaff: function() {
            var CityStaffCollection = new Staff(null, this.id);
            this.staffCollection = CityStaffCollection;
        }

    });
    return CityModel;
});