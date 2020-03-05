'use strict'

var express = require('express');
var albumController = require('../controllers/album');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/albums'});

api.get('/album/:id', md_auth.ensureAuth, albumController.getAlbum);
api.post('/save-album', md_auth.ensureAuth, albumController.saveAlbum);
api.get('/albums/:page?', md_auth.ensureAuth, albumController.getAlbums);
/*api.put('/update-artist/:id', md_auth.ensureAuth, albumController.updateArtist);
api.delete('/delete-artist/:id', md_auth.ensureAuth, albumController.deleteArtist);
api.post('/upload-artist-image/:id', [md_auth.ensureAuth, md_upload], albumController.uploadImage);
api.get('/get-artist-image/:imageFile', albumController.getImageFile);*/

module.exports = api; 