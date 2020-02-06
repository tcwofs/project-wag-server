/* eslint-disable strict */
'use strict';
const express = require('express');
const app = express();

const PORT = process.env.port || 5000;

const router = require('./router');

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io').listen(server);

io.on('connection', socket => {
  console.log('We have a new connection');

  socket.on('disconnect', () => {
    console.log('User left!');
  });
});

app.use(router);

server.listen(PORT, () => {
  console.log(`Running on port ${PORT}!`);
});
