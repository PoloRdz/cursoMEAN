'use strict'

var express = require('express');
//var bodyParser = require('body-parser');

var app = express();

var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

// cargar rutas
app.use(express.urlencoded({extender:false}));
app.use(express.json());

// cabeceras http

//rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

module.exports = app; 