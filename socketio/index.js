var socketio = require('socket.io');

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
    }

    disconnect (socket) {
        console.log('user disconnected');
        if ( !socket._id ) {
            return false;
        }
        delete this.users[socket.id];
        this.updateNickname();
    }

    newUser (data, callback, socket) {
        if (data._id in this.users) {
            callback(false);
        } else {
            callback(true);
            socket._id = data._id;
            this.users[socket._id] = socket;
            this.updateNickname();
        }
    }

    chat (data, callback, socket) {
        if (data.receiver in this.users) {
            this.users[data.receiver].emit('chat', {
                msg: data.msg,
                sender: socket._id
            });
        } else {
            this.users[socket._id].emit('err', {
                err: 'There is no this user'
            });
        }
    }

    listen () {
        this.io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('disconnect', (socket) => this.disconnect(socket));
            socket.on('newUser', (data, callback) => this.newUser(data, callback, socket));
            socket.on('chat', (data, callback) => this.chat(data, callback, socket));
        });
    }

    getUsers () {
        return this.users;
    }
};