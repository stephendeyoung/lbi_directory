define([
	'underscore',
	'backbone'
	], function(_, Backbone) {
    var EmployeeModel = Backbone.Model.extend({

        idAttribute: '_id',

    });
    return EmployeeModel;
});