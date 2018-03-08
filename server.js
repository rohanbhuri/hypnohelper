'use strict';

// dependencies
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path');

// create an instance of express
const app = express();

// configure body-parser to accept
// urlencoded bodies and json data
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//  to allow all cors origin
app.use(cors())

// connection to the database
require('./server/configs/database');

//serving index.html from dist
app.use(express.static(path.join(__dirname + '/dist')));

//serving data from public
app.use('/server/public/images',express.static(path.join(__dirname + '/server/public/images')));

// route registration
app.use('/api', require('./server/routes'));

// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/index.html'));
});

// error handling

// 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// 500 errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// set the port to use
const port = parseInt(process.env.PORT, 10) || 3001;

// start the server
const server = app.listen(port, () => {
  console.log(`App is running at: localhost:${server.address().port}`);
});
