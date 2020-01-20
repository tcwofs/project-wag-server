const express = require('express');
const path = require('path');
const app = express();

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io').listen(server);
// const fs = require('fs');

let rooms = 0;

// app.use('/media', express.static(__dirname + '/media'));
app.use(express.static(path.join(__dirname, '../build')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

io.on('connection', socket => {
  socket.on('createGame', data => {
    socket.join(`room-${++rooms}`);
    socket.emit('newGame', {
      name: data.name,
      room: `room-${++rooms}`,
      password: data.password,
    });
  });

  // socket.on('joinGame', date => {
  //   const room = io.nsps['/'].adapter.rooms[data.room];
  // });
});

server.listen(5000, function() {
  console.log(`Running on port 5000!`);
});

io.sockets.on('connection', function(socket) {
  // handler for incoming connections
  socket.on('chat', function(data) {
    var msg = JSON.parse(data);
    var reply = JSON.stringify({
      action: 'message',
      user: msg.user,
      msg: msg.msg,
    });
    socket.emit('chat', reply);
    socket.broadcast.emit('chat', reply);
  });

  socket.on('join', function(data) {
    var msg = JSON.parse(data);
    var reply = JSON.stringify({
      action: 'control',
      user: msg.user,
      msg: ' joined the channel',
    });
    socket.emit('chat', reply);
    socket.broadcast.emit('chat', reply);
  });
});
