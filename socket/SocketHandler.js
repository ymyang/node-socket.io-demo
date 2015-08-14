/**
 * Created by yang on 2015/8/6.
 */
const TAG = '[SocketHandler]-';
var MsgSender = require('./MsgSender.js');
var logger = require('../utils/logger.js');

var SocketHandler = module.exports = {};

var _io = undefined;
var cacheSockets = {};

SocketHandler.init = function(server) {
    _io = require('socket.io')(server);

    //客户端连接
    _io.on('connection', onConnection);
};

function onConnection(socket) {
    var userId = socket.handshake.query.ui;
    // 缓存客户端连接
    cacheSockets[userId] = socket;
    // 接受来自客户端的消息
    socket.on('message', function(data) {
        logger.debug(TAG, '[userId]-', userId, ':', data);
        MsgSender.sendMsg(data);
    });
    // 客户端断开连接
    socket.on('disconnect', function() {
        logger.debug(TAG, 'disconnect:', userId);
        delete cacheSockets[userId];
    });
};

SocketHandler.emit = function(data, userId) {
    if (userId) {
        if (userId === '*') {
            // 推送给全部客户端
            _io.emit('message', JSON.parse(data));
        } else {
            // 推送给制定用户
            var socket = cacheSockets[userId];
            if (socket) {
                socket.emit('message', JSON.parse(data));
            }
        }
    }
};