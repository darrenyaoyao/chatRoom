var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/practice');

var User = require('./app/models/user');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

router.get('/', function(req, res) {
    res.json({
        message: 'Welcome to our api!'
    });
});

router.route('/users')
    .post(function(req, res) {
        User.findOne({
            username: req.body.username
        }, function(err, user) {
            if (user) {
                if (user.password === req.body.password) {
                    res.json(user);
                } else {
                    res.status(401)
                        .send('Password is wrong.');
                }
            } else {
                var newUser = new User();
                newUser.username = req.body.username;
                newUser.password = req.body.password;
                newUser.save(function(err) {
                    if (err) {
                        res.send(err);
                    }
                    res.json(newUser);
                });
            }
        });
    })
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) {
                res.send(err);
            }
            res.json(users);
        });
    });

router.route('/users/:user_id')
    .get(function(req, res) {
        User.findById(req.params.bear_id, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.json(user);
        });
    })
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) {
                res.send(err);
            }
            user.username = req.body.username;
            user.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({
                    message: 'User updated!'
                });
            });
        });
    })
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err) {
                res.send(err);
            }
            res.json({
                message: 'Successfully deleted'
            });
        });
    });

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
