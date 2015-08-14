/**
 * Created by yang on 2015/8/6.
 */
const TAG = '[MsgListener]-';
var redis = require('redis');
var config = require('../config.json');
var sub = redis.createClient(config.redis.port, config.redis.host);
var SocketHandler = require('./SocketHandler.js');
var constants = require('../utils/constants.js');
var logger = require('../utils/logger.js');

var MsgListener = module.exports = {};

const pchannel = constants.channel.pchannel;
const upload = constants.channel.upload;

// 监听全局通道
sub.psubscribe(pchannel + '*');
sub.subscribe(upload);

// 接收redis通道的消息
sub.on('pmessage', function(pattern, channel, data) {
    var userId = channel.substr(channel.lastIndexOf('.') + 1);
    logger.debug(TAG, '[userId]:', userId, ', [channel]:', channel, ', [data]:', data);
    SocketHandler.emit(data, userId);
});

sub.on('message', function(channel, data) {
    // TODO
    logger.debug(TAG, '[channel]:', channel, ', [data]:', data);
});
