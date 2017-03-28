var express = require('express');
var router = express.Router();
var Conversation = require('../models/conversation');

router.get('/', function(req, res) {
    Conversation.find()
        .then(conversations => res.json(conversations))
        .catch(err => res.status(400).send(err));
});

module.exports = router;