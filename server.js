var http = require('http');
var fs = require('fs');
var ChatServer = require('./chat').ChatServer;

// Start up a web server
var server = http.createServer(function(request, response) {
	
	// When the index.html file is read, this callback is fired.
	// If we can't find the file, we return a 404. If we do find
	// the file, then we return a 200 with the contents of the
	// file contained in the response.
	var readFileCallback = function(err, data) {
		if (err) {
			// There was a problem reading the file. Return a 404.
			response.writeHead(404);

			// Log to the console if there's a problem to help
			// troublehsooting.
			console.error('error reading file: ');
			console.error(err);
		}

		response.writeHead(200);

		// Write the file's contents to the response.
		response.write(data);
		response.end();
	};

	// Read the index.html from disk in this directory.
	fs.readFile('index.html', readFileCallback);
});

// Listen on port 1337.
server.listen(1337);

// Initialize our chat server.
var chatServer = new ChatServer(server);
