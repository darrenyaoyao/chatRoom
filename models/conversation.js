var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var ConversationSchema = new Schema({
    userOne: [{type: Schema.Types.ObjectId, ref: 'User'}],
    userTwo: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Conversation', ConversationSchema);