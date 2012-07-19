var WebSocketServer = require('websocket').server;

var ChatUser = (function() {
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

	ChatUser.prototype.sendMessage = function(message) {
		console.log('sending message: ' + message);
		this.connection.sendUTF(message);
	};

	return ChatUser;
})();

exports.ChatServer = (function() {
	// constructor
	function ChatServer(httpServer) {
		var self = this;
		this.users = [];
		if (!httpServer) {
			throw 'httpServer is required';
		}

		// web socket server
		var socketServer = new WebSocketServer({
			httpServer: httpServer
		});

		var connectionRequest = function(request) {
			var connection = request.accept(null, request.origin);
			var chatUser = new ChatUser(self, connection);
			self.users.push(chatUser);
		};

		socketServer.on('request', connectionRequest);
	}

	ChatServer.prototype.publishMessage = function(sender, message) {
		this.users.forEach(function(user) {
			if (user != sender) {
				user.sendMessage(message);
			}
		});
	};

	return ChatServer;
})();
