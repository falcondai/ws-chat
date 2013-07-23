var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

server.listen(9000);
console.log('start chatting at: %s', 'http://localhost:9000/');

app.use(express.logger());
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

io.of('/chat').on('connection', function(socket) {
	socket.on('send', function(data) {
		socket.broadcast.emit('new message', data);
	});
});

io.of('/feed').on('connection', function(socket) {
	socket.on('join', function(data) {
		socket.broadcast.emit('joined', data);
	});
});