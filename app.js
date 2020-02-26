'use strict'

var express = require('express')
var bodyParser = require('body-parser')

var app = express();

var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist')

// cargar rutas
app.use(bodyParser.urlencoded({extender:false}));
app.use(bodyParser.json());

// cabeceras http

//rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes)

module.exports = app; 