
$(document).ready(function() {
    
var socket = io();

socket.on('connect', function(){
	console.log('Connected to server!!!!!!!!');
});

socket.on('message', function(message){
	console.log('New message:');
	console.log(message.text);
});

// Handle submitting of new message
$('#message-form').on('submit', function(event){
	
	event.preventDefault();
	
	var $message = $('#message-form').find('input[name=message]');
	
	socket.emit('message', {
		text: $message.val()
	});

	$message.val('');
});

});