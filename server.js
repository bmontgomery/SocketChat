var http = require('http');
var express = require('express');
var ChatServer = require('./chat').ChatServer;

var app = express();

var server = http.createServer(app);

// Start up a web server
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});

// Listen on port 1337.
server.listen(8080);

// Initialize our chat server.
var chatServer = new ChatServer(server);
