var socketio = require('socket.io');
var User = require('../models/user');
var Conversation = require('../models/conversation');
var Message = require('../models/message');

module.exports = class SocketServer {
    constructor(app) {
        this.users = {};
        this.io = socketio.listen(app);
        this.updateNickname = this.updateNickname.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.newUser = this.newUser.bind(this);
        this.chat = this.chat.bind(this);
        this.listen = this.listen.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }

    updateNickname () {
        this.io.sockets.emit('userID', Object.keys(this.users));
        User.find()
            .then(users => {
                this.io.sockets.emit('online', users);
            })
            .catch(err => {
                this.io.sockets.emit('err', {
                    err: 'Database error'
                });
            });
    }

    disconnect (socket) {
        console.log('user disconnected');
        if ( !socket._id ) {
            return false;
        }
        User.findById(socket._id)
            .then(user => {
                user.online = false;
                user.save()
                    .then(() => {
                        delete this.users[socket._id];
                        this.updateNickname();
                    });
            });
    }

    newUser (data, callback, socket) {
        User.findById(data._id)
            .then(user => {
                if (data._id in this.users) {
                    socket.emit('err', {
                        err: 'Wrong user ID (Duplicate)'
                    });
                } else {
                    user.online = true;
                    user.save()
                        .then(() => {
                            socket._id = data._id;
                            this.users[socket._id] = socket;
                            this.updateNickname();
                        });
                }
            })
            .catch(err => {
                socket.emit('err', {
                    err: 'Wrong user ID'
                });
            });
    }

    chat (data, socket) {
        if (data.receiver in this.users) {
            var p1 = Conversation.findOne({
                userOne: data.receiver,
                userTwo: socket._id
            });
            var p2 = Conversation.findOne({
                userOne: socket._id,
                userTwo: data.receiver
            });
            Promise.all([p1, p2]).then(values => {
                if ( !values[0] && !values[1]) {
                    var newConversation = new Conversation();
                    newConversation.userOne = socket._id;
                    newConversation.userTwo = data.receiver;
                    newConversation.save(() => {
                        var newMessage = new Message();
                        newMessage.message = data.msg;
                        newMessage.user = socket._id;
                        newMessage.conversation = newConversation._id;
                        newMessage.save();
                    });
                } else {
                    var exitConversation = values[0] || values[1];
                    var newMessage = new Message();
                    newMessage.message = data.msg;
                    newMessage.user = socket._id;
                    newMessage.conversation = exitConversation._id;
                    newMessage.save();
                }
            });
            this.users[data.receiver].emit('chat', {
                msg: data.msg,
                sender: socket._id
            });
        } else {
            this.users[socket._id].emit('err', {
                err: 'There is no this receiver ID'
            });
        }
    }

    listen () {
        this.io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('disconnect', () => this.disconnect(socket));
            socket.on('newUser', (data, callback) => this.newUser(data, callback, socket));
            socket.on('chat', (data) => this.chat(data, socket));
        });
    }

    getUsers () {
        return this.users;
    }
};