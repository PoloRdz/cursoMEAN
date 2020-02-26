'use strict'

var express = require('express');
var artistController = require('../controllers/artist');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/artist/:id', md_auth.ensureAuth, artistController.getArtist);
api.post('/save-artist', md_auth.ensureAuth, artistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, artistController.getArtists);
api.put('/update-artist/:id', md_auth.ensureAuth, artistController.updateArtist);

module.exports = api; 

