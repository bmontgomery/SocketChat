var WebSocketServer = require('websocket').server;

// # ChatUser
//
// A user and a connection are the same thing in this system.
// Represents a user who is connected to the chat room.
var ChatUser = (function() {

	// ## Constructor
	//
	// **svr**: The ChatServer
	//
	// **conn**: The WebSocket connection to which this ChatUser is
	// associated.
	function ChatUser(svr, conn) {
		var self = this;
		this.server = svr;
		this.connection = conn;

		var messageReceived = function(evt) {
			console.log('message received');
			self.server.publishMessage(self, evt.utf8Data);
		};

		this.connection.on('message', messageReceived);
	}

	// ## sendMessage
	//
	// **message**: the message to send to the user
	//
	// Sends a message to the user.
	ChatUser.prototype.sendMessage = function(message) {
		console.log('sending message: ' + message);
		this.connection.sendUTF(message);
	};

	return ChatUser;
})();

// # ChatServer
//
// The central object which manages users and ferries messages
// to and from users connected to the server.
exports.ChatServer = (function() {
	// ## Constructor
	//
	// **httpServer**: The web server to which to connect the Web Socket
	// server to allow connections to the chat server.
	function ChatServer(httpServer) {
		var self = this;
		this.users = [];
		if (!httpServer) {
			throw 'httpServer is required';
		}

		// Instantiate the Web Socket server
		var socketServer = new WebSocketServer({
			httpServer: httpServer
		});

		// Handles when a client connects to the Web Socket server
		var connectionRequest = function(request) {
			// Accept the Web Socket connection
			var connection = request.accept(null, request.origin);

			// Instantiate a ChatUser, and pass a reference to this
			// server and the connection to which this user corresponds
			var chatUser = new ChatUser(self, connection);
			self.users.push(chatUser);
		};

		// Listen for Web Socket ocnnection requests
		socketServer.on('request', connectionRequest);
	}

	// ## publicMessage
	//
	// **sender**: The ChatUser from which the message originated
	//
	// **message**: The message to send to the chat room
	//
	// Sends a message to all users connected to the Chat Server
	// except for the user from which the message was sent.
	ChatServer.prototype.publishMessage = function(sender, message) {
		this.users.forEach(function(user) {
			if (user != sender) {
				user.sendMessage(message);
			}
		});
	}

	return ChatServer;
})();
