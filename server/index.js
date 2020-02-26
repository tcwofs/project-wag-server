/* eslint-disable strict */
'use strict';
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const PORT = process.env.port || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const router = require('./router');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(router);

io.on('connection', socket => {
  console.log('User connected!');
  socket.emit('chat-message', 'Hello world!');

  socket.on('disconnect', () => {
    console.log('User left!');
  });
});

server.listen(PORT, () => {
  console.log(`Running on port ${PORT}!`);
});
