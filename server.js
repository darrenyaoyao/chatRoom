var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = require('./controllers/index');
var users = {};
mongoose.connect('mongodb://localhost/practice');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.use('/api', router);

app.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
});

http.listen(port, function() {
    console.log('listening on *:8080');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
        if ( !socket.nickname ) {
            return false;
        }
        delete users[socket.nickname];
        updateNickname();
    });

    socket.on('new user', function(data, callback) {
        if (data in users) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNickname();
        }
    });

    function updateNickname() {
        io.sockets.emit('username', Object.keys(users));
    }

    socket.on('chat message', function(data, callback) {
        var msg = data.trim();
        if (msg.substr(0,3) === '/w ') {
            msg = msg.substr(3);
            var ind = msg.indexOf(' ');
            if (ind !== -1) {
                var name = msg.substring(0, ind);
                msg = msg.substring(ind + 1);
                if (name in users) {
                    users[name].emit('whisper', {
                        msg: msg,
                        nickname: socket.nickname
                    });
                    console.log('Whisper!');
                } else {
                    callback('Error! Enter a valid user');
                }
            } else {
                callback('Error! Please enter a message for your whisper.');
            }
        } else {
            io.emit('chat message', {
                msg: msg,
                nickname: socket.nickname
            });
        }
    });
});