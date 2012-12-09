

$(document).on('ready', function() {


	$(document).ajaxStart(function() {
		$('#floatingCirclesG').css('opacity', '1');
	});

	$(document).ajaxComplete(function() {
		$('#floatingCirclesG').css('opacity', '0');
	});

	var width = 960,
		height = $(window).height() * 0.6,
		centered,
		zoomedIn = false;

	$('#map_container').height(height);

	var projection = d3.geo.mercator()
		.scale(width)
		.translate([0, 50]);

	var path = d3.geo.path()
		.projection(projection);

	var svg = d3.select("#map_container").append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr('id', 'worldMap');

	var g = svg.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.append("g")
		.attr("id", "countries");

	var c = svg.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		.append("g")
		.attr("id", "cities");

	var zoomOut = function(overlayWidth) {
		$('.mapOverlay')
			.animate({
				left: -overlayWidth,
				opacity: 0
			}, function() {
				$(this).remove();
				$('html,body').animate({
					scrollTop: 0
				}, 1000, function() {
					$('#staffList').empty();
				});
			});

	}

	var getData = function(d, callback) {

		var office = d.properties.NAME;
		var country = d.properties.ADM0_A3;
		if (!zoomedIn) {
			$.get('/data/' + office, function(data) {
				var source = $("#overlay").html();
				var template = Handlebars.compile(source);
				var containerWidth = $('#map_container').width();
				var containerHeight = $('#worldMap').height();
				var overlayWidth = containerWidth / 2.5;
				$('#map_container').append(template(data));
				$('.mapOverlay')
					.css({
						width: overlayWidth,
						height: containerHeight + 13,
						left: -overlayWidth
					})
					.animate({
						left: 0,
						opacity: 1
					});
				$('.mapOverlay').on('zoomOut', function() {
					zoomOut(overlayWidth);
				});
				$('#zoomOut').on('click', function() {
					c.select('.active').each(function(d, i) {
						zoomIn.apply(this, [d, i]);
					});
				});
				$('#departments').on('submit', function() {
					var department = $('#department').val();
					staffData.retrieveData(department, office);
					return false;
				});
				$('#all').on('submit', function() {
					staffData.retrieveData(null, office);
					return false;
				});
				callback();
			});
		}

		else {
			callback();
		}
	};

	var zoomIn = function (d, i) {
		getData(d, function() {
			var data = $('#' + d.properties.ADM0_A3).data('centroid'),
				x = 0,
				y = 0,
				k = 1,
				isUSA = d.properties.ADM0_A3 === 'USA';

			if (d && centered !== d) {
				var x = isUSA ? -data[0] - 100 : -data[0];
				var y = isUSA ? -data[1] - 50 : -data[1];
				k = 4;
				centered = d;
			} else {
				centered = null;
			}

			c.selectAll("path")
				.classed("active", centered && function(d) { 

					var test = d === centered; 
					zoomedIn = true;
					if (test) {
					  return true;
					}
				})
				.classed('inactive', function(d) {
					var test = d === centered;
					if (!test) {
					  return true;
					}
				});

			if (c.selectAll('.active')[0].length < 1) {
				zoomedIn = false;
				c.selectAll("path")
				  .classed('inactive', false);
				$('.mapOverlay').trigger('zoomOut');
			}

			g.transition()
				.duration(1000)
				.attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")");

			c.transition()
				.duration(1000)
				.attr("transform", "scale(" + k + ")translate(" + x + "," + y + ")");
		});
	}

	d3.json("/javascripts/world-map/countries.geojson", function(json) {
		g.selectAll("path")
			.data(json.features)
			.enter().append("path")
			.attr("d", path)
			.attr('id', function(d) {
				return d.properties.ADM0_A3;
		  	})
			.each(function(d) {
				$.data(this, 'centroid', path.centroid(d));
			});
	});

	d3.json("/javascripts/world-map/lbiCities.json", function(json) {
		c.selectAll("path")
			.data(json.features)
			.enter().append("path")
			.attr("d", path)
			.on("click", zoomIn);
	});
});