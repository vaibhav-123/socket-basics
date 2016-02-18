var express = require('express');
var PORT = process.env.PORT || 3000;
// create app
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
	console.log('New user connected via socket.io!!!!');

	socket.on('message', function(message){
		console.log('Message received :'+ message.text);
		
		// send the message to all users except sender
		socket.broadcast.emit('message', message);
	});

	socket.emit('message', {
		text: 'Wellcome to chat application!!!!' 
	});
});

http.listen(PORT, function(){
	console.log('Server started');
});


