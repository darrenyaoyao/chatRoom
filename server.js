var express = require('express');
var app = express();
var http = require('http').Server(app);
var SocketServer = require('./socketio/index');
var io = new SocketServer(http);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = require('./controllers/index');
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

io.listen();