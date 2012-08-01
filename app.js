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
, decode   = require('./decoders');

var app = express();
var heat_start = 0;
var input_device = '';
var heat_duration = 0;
var	dn_stamp = 0.0,
up_stamp = 0.0,
dn_last = 0.0,
up_last = 0.0,
brew_last = 0.0,
heating = false,
brew_time = 5*60*1000,
warming_interval = 4*60*1000,
happenen = Date.now();
var ticks=0;
if(process.env.input !=''){
	input_device="/dev/input/"+process.env.input;
}else{
	if(process.argv.length != 3) {
		console.log("supply input device name");
		console.log("eg, node "+process.argv[1]+ "event13");
		exit(0);
	}else{
		input_device="/dev/input/"+process.argv[2];
	}
}
console.log("readng events from "+input_device);


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
	app.use(express.errorHandler());
});
app.configure('production', function(){
	console.log("configure Production mode");
	app.use(express.errorHandler());
});


app.get('/', function(req, res) {
		  res.render('index', {history:history,title: 'The Office Coffee Pot'});
	});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

fs.open(input_device, "r", function (err, fd) {
	if (err) throw err;
	var buffer = new Buffer(24),
	heating = false,
	mouse_event = {};
	function startRead() {
		fs.read(fd, buffer, 0, 24, null, function (err, bytesRead) {
			if (err) throw err;

			mouse_event = decode.mouse_event(buffer);
			if(mouse_event.button == 'R'){
				happenen=Date.now();
				if(mouse_event.state == 'D') {
					history.insert("het:"+Date());
					//client.emit("message","het:"+Date());
					console.log("het:"+Date());
					dn_stamp = mouse_event.time;
					var period = dn_stamp - dn_last;
					history.insert("per:"+Date()+"#"+period+"("+dn_stamp+"-"+dn_last+")");
					console.log("per:"+Date()+"#"+period);
					//client.emit("message","per:"+Date()+"#"+period+"("+dn_stamp+"-"+dn_last+")");
					//TODO: seems klugie. mouse event per connection?
					if(ticks++ == 0) {
						dn_last = dn_stamp;
					}

					heating=true;
				} 
				if(mouse_event.state == 'U'){
					ticks=0;
					up_stamp = mouse_event.time;
					var duration = up_stamp - dn_stamp;
					if(duration > brew_time){
						history.insert("brw:"+Date());
						console.log("brw:"+Date());
						//client.emit("message","brw:"+Date());
						brew_last = Date.now();
					}
					history.insert("dur:"+ Date()+"#" + duration);
					console.log("dur:"+ Date()+"#" + duration);
					//client.emit("message","dur:"+ Date()+"#" + duration);
					up_last = up_stamp;
					heating=false;
				}
			} 	
			startRead();
		});
	}
	startRead();
});
function handle_timeout() {
	if(!heating) {
		if((Date.now()-happenen) < warming_interval) {
			console.log("on :"+Date());
			history.insert("on :"+Date());
			//client.emit("message","on :"+Date());
		}else {
			console.log("off:"+Date());
			history.insert("off:"+Date());
			//client.emit("message","off:"+Date());
		}
	}
	if(brew_last != 0.0) {
		console.log("last brew was "+ (Date.now() - brew_last)/60000 + " Minutes Ago");
		history.insert("message","last brew was "+ (Date.now() - brew_last)/60000 + " Minutes Ago");
		//client.emit("message","last brew was "+ (Date.now() - brew_last)/60000 + " Minutes Ago");
	}
	startTimeout(handle_timeout, warming_interval);
}

function startTimeout(){
	setTimeout(handle_timeout, warming_interval);
}

startTimeout();


