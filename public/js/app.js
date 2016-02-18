
$(document).ready(function() {

    var name = getQueryVariable('name') || 'Anonymous';
    var room = getQueryVariable('room');
    console.log(name + ' Wants to join ' + room );   

	var socket = io();

	socket.on('connect', function(){
		console.log('Connected to server!!!!!!!!');
	});

	socket.on('message', function(message){

		var timeStampMoment = moment().utc(message.timeStamp);
		
		$(".messages").append('<p><strong>' + message.name + ' ' + timeStampMoment.format('h:mm:ssa') + '</strong></p>');
		$(".messages").append('<p>' + message.text + '</p>');
	});

	// Handle submitting of new message
	$('#message-form').on('submit', function(event){
		
		event.preventDefault();
		
		var $message = $('#message-form').find('input[name=message]');

		socket.emit('message', {
			name: name,
			text: $message.val()
		});

		$message.val('');
	});
});