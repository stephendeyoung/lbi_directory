
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , mongodb = require('mongodb');

var app = express();

// Replace these with your custom settings
var HOST = '127.0.0.1';
var PORT = 27017;
var dbUser = undefined;
var dbPassword = undefined;

var db = function(res, callback) {
	var server = new mongodb.Server(HOST, PORT, {});
	new mongodb.Db('admin', server).open(function (error, client) {
	    if (error) {
			res.writeHead(500);
			res.end('\n');
		} else {
			if (dbUser) {
		        client.authenticate(dbUser, dbPassword, function(err, p_client) {
					callback(server, client);
				});
			} else {
				callback(server, client);
			}
		}
	});
};

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(__dirname));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
	res.render('index.jade', {
		title: 'LBi'
	});
});

app.get('/:city', function(req, res) {
	res.render('index.jade', {
		title: 'LBi'
	});
});

app.get('/countryData/:type', function(req, res) {
	db(res, function(server, client) {
		var mapDb = client.db('mapData');
		var collection = new mongodb.Collection(mapDb, req.params.type);

		collection.find({}, {'geometry': 1, 'type': 1, 'properties': 1}).toArray(function(err, docs) {
			docs.forEach(function(val) {
				val.ADM0_A3 = val.properties.ADM0_A3;
				val.NAME = val.properties.NAME;
				delete val.properties;
			});
			res.writeHead(200, {'content-type': 'text/json' });
			res.write( JSON.stringify({ data : docs}) );
			res.end('\n');
			client.close();
		});
	});
});

app.get('/countryData/:city/staff', function(req, res) {
	db(res, function(server, client) {
		var cityDb = client.db('cities');
		var collection = new mongodb.Collection(cityDb, req.params.city.replace(/\s/g, '')),
		data;

		data = collection.find();

		data.toArray(function(err, docs) {
			res.writeHead(200, {'content-type': 'text/json' });
			res.write( JSON.stringify({ staff : docs}) );
			res.end('\n');
			client.close();
		});
	});
});

app.get('/countryData/cities/:office', function(req, res) {
	db(res, function(server, client) {
		var cityDb = client.db('cities');
		var collection = new mongodb.Collection(cityDb, req.params.office.replace(/\s/g, ''));

		collection.distinct('department', function(err, docs) {
			if (err) {
				res.writeHead(500);
				res.end('\n');
			}

			else {
				res.writeHead(200, {'content-type': 'text/json' });
				res.write( JSON.stringify({
					departments : docs
					})
				);
				res.end('\n');
				client.close();
			}
		});
	});
});

app.get('/manager/:name', function(req, res) {

	db(res, function(server, client) {
		var cityDb = client.db('cities');
		var data = collection.find({'manager': req.params.name}, {'givenName': 1, 'sn': 1, 'thumbnailPhoto': 1, '_id': 1});

		if (data) {
			data.toArray(function(err, docs) {
				res.writeHead(200, {'content-type': 'text/json' });
				res.write(JSON.stringify({"staff": docs}));
				res.end('\n');
				client.close();
			});
		}

		else {
			res.writeHead(400);
			res.end('\n');
		}
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
