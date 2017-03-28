var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var MessageSchema = new Schema({
    message: String,
    time: {
        type: Date, default: Date.now
    },
    user: [{type: Schema.Types.ObjectId, ref: 'User'}],
    conversation: [{type: Schema.Types.ObjectId, ref: 'Conversation'}]
});

module.exports = mongoose.model('Message', MessageSchema);