'use strict';
const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

require('./utils/socket/socket').listen(http);
const router = require('./utils/router');

const PORT = process.env.port || 5000;

app.use(cors());
app.use(router);

http.listen(PORT, () => {
  console.log(`Running on port ${PORT}!`);
});
