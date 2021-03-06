var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/', function(req, res) {
    User.findOne({
        username: req.body.username
    }).then( user => {
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
    }).catch( err => res.status(400).send(err));
});

router.get('/', function(req, res) {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).send(err));
});

router.get('/:user_id', function(req, res) {
    User.findById(req.params.user_id)
        .then(user => res.json(user))
        .catch(err => res.status(400).send(err));
});

router.put('/:user_id', function(req, res) {
    User.findById(req.params.user_id)
        .then(user => {
            user.username = req.body.username;
            user.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({
                    message: 'User updated!'
                });
            });
        })
        .catch(err => res.status(400).send(err));
});

router.delete('/:user_id', function(req, res) {
    User.remove({
        _id: req.params.user_id
    }).then(user => res.json({
        message: 'Successfully deleted'
    })).catch(err => res.status(400).send(err));
});

module.exports = router;