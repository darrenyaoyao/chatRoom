var socketio = require('socket.io');
var User = require('../models/user');

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