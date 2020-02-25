'use strict'

var express = require('express');
var userController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

var api = express.Router();

api.get('/probando-controlador', md_auth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.login);
api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);
api.post('/upload-user-image/:id', [md_auth.ensureAuth, md_upload], userController.uploadImage);

module.exports = api;