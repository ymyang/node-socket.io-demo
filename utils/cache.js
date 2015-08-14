/**
 * Created by yang on 2015/7/4.
 */
var redis = require('redis');
var Promise = require('bluebird');
var config = require('../config.json');

var cache = module.exports = {};

var client = redis.createClient(config.redis.port, config.redis.host);

cache.flushAll = function(){
    return new Promise(function(resolve, reject) {
        client.send_command("flushall",[],function(err,r){
            if (err) {
                reject(err);
            }
            else{
                resolve(r);
            }

        });
    });

}

/**
 * 删除缓存
 * @param key
 */
cache.delete = function(key) {
    client.del(key);
};

/**
 * 缓存字符串
 * @param key
 * @param value
 * @param expire 有效时间，单位：秒
 */
cache.set = function(key, value, expire) {
    client.set(key,  value);
    if (expire) {
        client.expire(key, expire);
    }
};

/**
 * 取缓存的字符串
 * @param key
 * @returns {Promise}
 */
cache.get = function(key) {
    return new Promise(function(resolve, reject) {
        client.get(key, function(err, reply) {
            if (err) {
                reject(err);
            }
            resolve(reply);
        });
    });
};

/**
 * 缓存对象
 * @param key
 * @param obj
 * @param expire 有效时间，单位：秒
 */
cache.hmset = function(key, obj, expire) {
    client.hmset(key,  obj);
    if (expire) {
        client.expire(key, expire);
    }
};

/**
 * 取缓存的对象
 * @param key
 * @returns {Promise}
 */
cache.hmget = function(key) {
    return new Promise(function(resolve, reject) {
        client.hgetall(key, function(err, reply) {
            if (err) {
                reject(err);
            }
            resolve(reply);
        });
    });
};