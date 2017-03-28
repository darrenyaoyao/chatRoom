var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var UserSchema = new Schema({
    username: String,
    password: String,
    online: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);