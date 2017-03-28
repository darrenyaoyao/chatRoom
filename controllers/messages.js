var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var Conversation = require('../models/conversation');

router.get('/', function(req, res) {
    Message.find()
        .then(messages => res.json(messages))
        .catch(err => res.status(400).send(err));
});

router.get('/:userOneId/:userTwoId', function(req, res) {
    var userOneId = req.params.userOneId;
    var userTwoId = req.params.userTwoId;
    var p1 = Conversation.findOne({
        userOne: userOneId,
        userTwo: userTwoId
    });
    var p2 = Conversation.findOne({
        userOne: userTwoId,
        userTwo: userOneId
    });
    Promise.all([p1, p2]).then(values => {
        if ( !values[0] && !values[1]) {
            res.json([]);
        } else {
            var id = values[0] || values[1];
            Message.find({
                conversation: id
            }).then(messages => res.json(messages))
            .catch(err => res.status(400).send(err));
        }
    });
});

module.exports = router;