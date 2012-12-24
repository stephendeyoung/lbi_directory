// Browser testing
// More routing (plus remove animation if path exists)
// Get departments on load
// Code refactor (Backbone and Node)
// Tidy UI
	// Loading icon on staff selection
	// Sometimes can't scroll upwards after new staff load
	// Animate popup
// Refactor CSS
// Enable download and initialisation of app from command line
// Unit tests

define([
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'collections/cities',
	'views/cityView',
	'routes/mapRouter'
	], function($, _, Backbone, d3, Cities, CityView, MapRouter) {
	var createMap = Backbone.View.extend({

	  	el: '#mapContainer',

	  	map: 'worldMap',

		mapWidth: 960,

	  	mapHeight: $(window).height() * 0.6,

	  	Router: new MapRouter(),

	  	events: {
	  		'zoom': function(event, city) {
	  			this.triggerZoom.apply(this, [city]);
	  		}
	  	},

	  	projection: function() {
	  		return d3
	  				.geo.mercator()
					.scale(this.mapWidth)
					.translate([0, 50]);
		},

		path: function() {
			return d3
					.geo.path()
					.projection(this.projection());
		},


	  	groupings: function(id) {
	  		return d3
	  				.select('#' + this.map)
	  				.append("g")
					.attr("transform", "translate(" + this.mapWidth / 2 + "," + this.mapHeight / 2 + ")")
					.append("g")
					.attr("id", id);
	  	},

		countries: function() {
			return this.groupings('countries');
		},

		cities: function() {
			return this.groupings('cities');
		},

	  	initialize: function() {
	  		var that = this;
	  		that.ajaxEnd(function() {
		  		that.createSVG(function() {
			  		that.getCountries(function(countries) {
			  			that.drawCountries(countries, function() {
			  				Cities.fetch({
			  					success: _.bind(that.render, that, that.beginRouting)
			  				});
			  			});
			  		});
			  	});
			});
	  	},

	  	ajaxEnd: function(callback) {
	  		$('#olMask').ajaxStop(function() {
	  			$(this).hide();
	  			$(this).find('img').hide();
	  		});
	  		callback();
	  	},

	  	createSVG: function(callback) {
	  		d3
	  			.select(this.el)
				.append("svg")
				.attr("width", this.mapWidth)
				.attr('id', this.map);

			if (callback) {
				callback();
			}
	  	},

	  	getCountries: function(callback) {
	  		d3.json('/countryData/countries', function(data) {
	  			return callback(data.data);
	  		});
	  	},

	  	drawCountries: function(countries, callback) {
	  		var that = this;

	  		that.countries()
	  			.selectAll("path")
				.data(countries)
				.enter().append("path")
				.attr("d", that.path())
				.attr('id', function(d) {
					return d.ADM0_A3;
			  	})
			  	.each(function(d) {
					$.data(this, 'centroid', that.path().centroid(d));
				});

			if (callback) {
				callback();
			}
	  	},

	  	render: function(callback, collection, response) {
	  		var that = this;

			that.cities()
				.selectAll("path")
				.data(response.data)
				.enter().append("path")
				.attr("d", that.path())
				.attr('id', function(d) {
					return d.NAME.replace(' ', '-');
			  	})
				.on("click", _.bind(that.zoom, that));

			if (callback) {
				callback();
			}

			return that;
	  	},

	  	beginRouting: function() {
	  		Backbone.history.start({pushState: true});
	  	},

	  	zoom: function (d, i) {
			var data = Cities.get(d.NAME).get('centroid'),
				x = 0,
				y = 0,
				scale = 1,
				cities = d3.select('#cities'),
				countries = d3.select('#countries'),
				isUSA = d.ADM0_A3 === 'USA',
				zoomedIn = cities.selectAll('.active')[0].length > 0 ? cities.selectAll('.active').datum().NAME === d.NAME : false;

			if (!zoomedIn) {
				x = isUSA ? -data[0] - 100 : -data[0];
				y = isUSA ? -data[1] - 50 : -data[1];
				scale = 4;

				$('.mapOverlay').trigger('removeOverlay');

				cities
					.selectAll("path")
					.classed("active", function(datum, index) {
						return d.NAME === datum.NAME ? true : false;
					})
					.classed('inactive', function(datum, index) {
						return d.NAME === datum.NAME ? false : true;
					});

				this.transition([countries, cities], scale, x, y, function() {
					this.cityView(Cities.get(d.NAME));
				});
			} else {
				cities
					.select('.active')
					.classed('active', false);
				cities
					.selectAll("path")
				  	.classed('inactive', false);

				this.Router.navigate('');
				$('.mapOverlay').trigger('removeOverlay');
				this.transition([countries, cities], scale, x, y);
			}

		},

		transition: function(elements, scale, x, y, callback) {
			elements.forEach(function(val, i) {
				val
					.transition()
					.duration(1000)
					.attr("transform", "scale(" + scale + ")translate(" + x + "," + y + ")");
			});
			if (callback) {
				callback.call(this);
			}
		},

		cityView: function(model, response) {
			this.Router.navigate(model.id.replace(/\s/g, '-'));
            return new CityView({model: model});
        },

		triggerZoom: function(city) {
			var that = this;
			var selector = typeof city !== 'string' ? '.active' : '#' + city.replace(' ', '-');

			d3
				.select('#cities')
				.select(selector)
				.each(function(d, i) {
					that.zoom.apply(that, [d, i]);
				});
		}

  	});
  	return createMap;

  });