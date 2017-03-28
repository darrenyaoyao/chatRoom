var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var UserSchema = new Schema({
    username: String,
    password: String
});

module.exports = mongoose.model('User', UserSchema);