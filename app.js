/**
 * Monitor The Office Coffee Pot
 */

var express = require('express')
, sys  = require('util')
, fs   = require('fs')
, io = require('socket.io')
, routes = require('./routes')
, http = require('http')
, events = require('events')
, history = require('./history')
, decode   = require('./decoders')
, thepot = require('./thepot');

var app = express();

var ip='127.0.0.1';

app.configure(function(){
	app.set('port', process.env.PORT || 4321);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	console.log("configure Development mode");
	app.set('ip', process.env.ip || '127.0.0.1');
	app.use(express.errorHandler());
});
app.configure('production', function(){
	console.log("configure Production mode");
	app.set('ip', process.env.ip || 'pi.redinger.me');
	app.use(express.errorHandler());
});

app.get('/', function(req, res) {
		  res.render('index', {history:history,title: 'The Office Coffee Pot'});
	});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

thepot.monitor();

