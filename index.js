var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    socket.on('click', function(msg){
        io.emit('click', msg);
        console.log("jump");
    });

    socket.on('left', function(msg){
        io.emit('left', msg);
    });

    socket.on('right', function(msg){
        io.emit('right', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});

