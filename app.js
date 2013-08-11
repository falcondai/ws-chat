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
    // welcome message
    socket.emit('new feed', {
        body: 'connected to Chatty!'
    });

    socket.on('join', function (data) {
        socket.set('name', data.name, function () {
            socket.broadcast.emit('new member', {
                id: socket.id,
                name: data.name
            });
        });
    });

    // Google Wave-like partial message
    socket.on('partial', function (data) {
        socket.get('name', function (err, name) {
            socket.broadcast.emit('new partial', {
                id: socket.id,
                sender: name,
                body: data.body
            });
        });
    });

    socket.on('send', function (data) {
        socket.get('name', function (err, name) {
            socket.broadcast.emit('new message', {
                id: socket.id,
                sender: name,
                body: data.body
            });
        });
    });

    socket.on('disconnect', function () {
        socket.get('name', function (err, name) {
            socket.broadcast.emit('member disconnected', {
                id: socket.id,
                name: name
            });
        });
    });

    socket.on('anything', function (data) {
        console.log('unreserved message: ', data);
    });
});
