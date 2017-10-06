var express = require("express");
var ejd = require("ejs");
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");
var app = express();

app.use(session({ secret: 'codingdojorocks' }));
app.use(bodyParser.urlencoded({ extended: true }));
//static content
app.use(express.static(path.join(__dirname, "./static")));
//setup views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.render("index");
})
app.post('/', function (req, res) {
	res.render("index");
})

///////////////////////////////  vSOCKET SETUP   //////////////////////////////////////////////
var server = app.listen(8000, function () {
	console.log("listening on port 8000");
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	console.log("Client/socket is connected!");
	console.log("Client/socket id is: ", socket.id);
	// all the server socket code goes in here
	socket.on("posting_form", function (data) {
		// console.log('Someone clicked a button!  Reason: ' + data.reason);
		var rnd = Math.floor(Math.random()*1001);
		console.log(data.name, data.location, data.language, data.comment)
		socket.emit('updated_message', { 
			title: '',
			name: data.name, 
			location: data.location,
			language: data.language, 
			comment: data.comment,
			random_number: "Your lucky number is: " + rnd
		});
		// broadcast to everyoe
		socket.broadcast.emit('updated_message', {
			
			title: data.name + " wrote:    >>>>>>>>>>>>>>>>>>.",
			name: data.name,
			location: data.location,
			language: data.language,
			comments: data.comment,
			random_number: "Your lucky number is: " + rnd
		});
	})
})
