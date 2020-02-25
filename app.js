'use strict'

var express = require('express')
var bodyParser = require('body-parser')

var app = express();

var user_routes = require('./routes/user');

// cargar rutas
app.use(bodyParser.urlencoded({extender:false}));
app.use(bodyParser.json());

// cabeceras http

//rutas base
app.use('/api', user_routes);

module.exports = app;