var http = require('http');
var fs = require('fs');
var ChatServer = require('./chat').ChatServer;

// basic web server functionality.
var server = http.createServer(function(request, response) {
	// the read file callback (see below)
	// gets the data from the file read operation and puts it into the
	// response, then ends the response to send it to the client
	var readFileCallback = function(err, data) {
		if (err) {
			response.writeHead(404);

			console.error('error reading file: ');
			console.error(err);
		}

		response.writeHead(200);
		response.write(data);
		response.end();
	};

	// this reads the index.html file from disk and calls the callback
	fs.readFile('index.html', readFileCallback);
});

// listen on a port
server.listen(1337);

// initialize the chat server
var chatServer = new ChatServer(server);
