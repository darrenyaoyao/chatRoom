module.exports = function(req, res, next) {
    console.log('Something is happening.');
    next();
};