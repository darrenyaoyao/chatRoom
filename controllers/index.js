var express = require('express');
var router = express.Router();
var index = require('../middlewares/index');

router.use(index);

router.get('/', function(req, res) {
    res.json({
        message: 'Welcome to our api!'
    });
});

router.use('/users', require('./users'));
router.use('/conversations', require('./conversations'));
router.use('/messages', require('./messages'));

module.exports = router;