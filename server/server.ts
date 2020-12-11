const express = require('express');
const ws = require('ws');

const app = express();

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', (socket: any) => {
  socket.on('message', (message: any) => console.log(message));
});

const server = app.listen(3000);
server.on('upgrade', (request: any, socket: any, head: any) => {
  wsServer.handleUpgrade(request, socket, head, (socket: any) => {
    wsServer.emit('connection', socket, request);
  });
});