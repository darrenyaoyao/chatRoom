var socketio = require('socket.io');

module.exports = class SocketServer {
    constructor(app) {
        this.users = {};
        this.io = socketio.listen(app);
        this.updateNickname = this.updateNickname.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.newUser = this.newUser.bind(this);
        this.chatMessage = this.chatMessage.bind(this);
        this.listen = this.listen.bind(this);
        this.getUsers = this.getUsers.bind(this);
    }

    updateNickname () {
        this.io.sockets.emit('username', Object.keys(this.users));
    }

    disconnect (socket) {
        console.log('user disconnected');
        if ( !socket.nickname ) {
            return false;
        }
        delete this.users[socket.nickname];
        this.updateNickname();
    }

    newUser (data, callback, socket) {
        if (data in this.users) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            this.users[socket.nickname] = socket;
            this.updateNickname();
        }
    }

    chatMessage (data, callback, socket) {
        var msg = data.trim();
        if (msg.substr(0,3) === '/w ') {
            msg = msg.substr(3);
            var ind = msg.indexOf(' ');
            if (ind !== -1) {
                var name = msg.substring(0, ind);
                msg = msg.substring(ind + 1);
                if (name in this.users) {
                    this.users[name].emit('whisper', {
                        msg: msg,
                        nickname: socket.nickname
                    });
                    console.log('Whisper!');
                } else {
                    callback('Error! Enter a valid user');
                }
            } else {
                callback('Error! Please enter a message for your whisper.');
            }
        } else {
            this.io.emit('chat message', {
                msg: msg,
                nickname: socket.nickname
            });
        }
    }

    listen () {
        this.io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('disconnect', (socket) => this.disconnect(socket));
            socket.on('newUser', (data, callback) => this.newUser(data, callback, socket));
            socket.on('chat message', (data, callback) => this.chatMessage(data, callback, socket));
        });
    }

    getUsers () {
        return this.users;
    }
};