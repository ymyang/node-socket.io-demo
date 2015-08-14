/**
 * Created by yang on 2015/6/22.
 */
const TAG = '[socket]-';
var http = require('http');
var app = require('express')();
var server = http.createServer(app);
var redis = require('redis');
var config = require('./config.json');
var sub = redis.createClient(config.redis.port, config.redis.host);
var SocketHandler = require('./socket/SocketHandler.js');
var logger = require('./utils/logger.js');

require('./socket/MsgListener.js');

SocketHandler.init(server);

var port = 3001;
server.listen(port);

server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(TAG, bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(TAG, bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    logger.info(TAG, 'Listening on ', bind);
}