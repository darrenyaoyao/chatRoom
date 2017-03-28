var express = require('express');
var app = express();
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

app.listen(port);
console.log('Magic happens on port ' + port);
