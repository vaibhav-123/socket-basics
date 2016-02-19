var express = require('express');
var PORT = process.env.PORT || 3000;
// create app
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var now = moment();

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

// sends current users to provider sockets
function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
    var users = [];

    if (typeof info === 'undefined') {
    	return;
    } else {
    	Object.keys(clientInfo).forEach(function(socketId){

    		var userInfo = clientInfo[socketId];
    		if(info.room == userInfo.room) {
    			users.push(userInfo.name);
    		}
    	});

    	socket.emit('message', {
    			name: 'System',
				text: 'Current Users : ' + users.join(', '),
				timeStamp: now.format('x')
    	});
    }
}

io.on('connection', function(socket){
	console.log('New user connected via socket.io!!!!');

	socket.on('disconnect', function(){
		var userData = clientInfo[socket.id];

		if(typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!!',
				timeStamp: now.format('x')	
			});

			delete clientInfo[socket.id]
		}
	});

	socket.on('joinRoom', function(req){
         
        clientInfo[socket.id] = req;  
		// Add socket to specific room(here name of room is in req obj)
		socket.join(req.room);
		// send to every socket except current socket
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: req.name + ' has joined!!',
			timeStamp: now.format('x') 
		});
	});

	// emit to users by room name
	socket.on('message', function(message){
		console.log('Message received :'+ message.text);
		
		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);	
		} else {
			message.timeStamp = now.format('x');
			// send the message to all users including sender
			io.to(clientInfo[socket.id].room).emit('message', message);
			//io.emit('message', message);
			// send the message to all users except sender
			//socket.broadcast.emit('message', message);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Wellcome to chat application!!!!',
		timeStamp: now.format('x') 
	});
});

http.listen(PORT, function(){
	console.log('Server started');
});


