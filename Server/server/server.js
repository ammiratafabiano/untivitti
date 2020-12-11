"use strict";
var express = require('express');
var ws = require('ws');
var app = express();
var wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', function (socket) {
    socket.on('message', function (message) { return console.log(message); });
});
var server = app.listen(3000);
server.on('upgrade', function (request, socket, head) {
    wsServer.handleUpgrade(request, socket, head, function (socket) {
        wsServer.emit('connection', socket, request);
    });
});
