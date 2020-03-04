'use strict';
const express = require('express');
const app = express();
const http = require('http').Server(app);

const io = require('./utils/socket').listen(http);
const router = require('./utils/router');

const PORT = process.env.port || 5000;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(router);

http.listen(PORT, () => {
  console.log(`Running on port ${PORT}!`);
});
