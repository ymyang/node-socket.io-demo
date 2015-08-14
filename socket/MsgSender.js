/**
 * Created by yang on 2015/8/4.
 */
const TAG = '[MsgSender]-';
var config = require('../config.json');
var redis = require('redis');
var pub = redis.createClient(config.redis.port, config.redis.host);
var constants = require('../utils/constants.js');
var logger = require('../utils/logger.js');

var MsgSender = module.exports = {};

const pchannel = constants.channel.pchannel;

MsgSender.sendMsg = function(data) {
    var channel = pchannel + msg.receiverId;
    logger.debug(TAG, '[channel]-', channel);
    //logger.debug(TAG, 'msg:', msg);
    // 发送消息至redis
    MsgSender.publish(channel, msg);
};

MsgSender.publish = function(channel, data) {
    pub.publish(channel, JSON.stringify(data));
};