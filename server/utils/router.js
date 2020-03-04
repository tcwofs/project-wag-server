'use strict';
const express = require('express');
const router = express.Router();
const services = require('../services.json');
// const path = require('path');

router.get('/', (req, res) => {
  res.send('server is up and running!');
});

// router.use(express.static(path.join(__dirname, '../build')));
// router.get('/*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

router.get('/api/services', (req, res) => {
  res.json(services);
});

router.get('*', function(req, res) {
  res.status(404).send('Error 404 - Page not found');
});

module.exports = router;
