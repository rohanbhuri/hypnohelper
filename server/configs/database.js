'use strict';

const mongoose = require('mongoose');
var config = require('./database')

exports.databaseName = 'hypnohelper';

exports.url = "mongodb://root:root@ds261678.mlab.com:61678/" + config.databaseName;

mongoose.connect(config.url);

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.on('open', () => {
  console.log(`Connected to the ${config.databaseName} database`);
});
