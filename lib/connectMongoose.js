'use strict';

const mongoose = require('mongoose');

const conn = mongoose.connection;

conn.on('open', () => {
    console.log('Conectado a mongoDB');
});

conn.on('error', err => {
    console.error('Error de conexion', err);
    process.exit(1);
});


mongoose.connect('mongodb://localhost/myAPI', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = conn;