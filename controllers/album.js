'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var artistModel = require('../models/artist');
var albumModel = require('../models/album');
var songModel = require('../models/song');

function getAlbum(req, res){
    var albumId = req.params.id;

    albumModel.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        } else{
            if(!album){
                res.status(404).send({message: 'El album no existe'});
            } else{
                res.status(200).send({album: album});
            }
        }
    });
}

function getAlbums(req, res){
    var artistId = req.params.artist;

    if(!artistId){
        var find = albumModel.find({}).sort('title');
    } else {
        var find = albumModel.find({artist: artistId}).sort('year');
    }
    find.populate({path: 'artist'}).exec((err, albums) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        } else{
            if(!albums){
                res.status(404).send({message: 'No hay albums'});
            } else{
                return res.status(200).send({ albums: albums });
            }
        }
    });
}

function saveAlbum(req, res){
    var album = new albumModel();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;
    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar'})
        } else{
            if(!albumStored){
                res.status(404).send({message: 'El album no ha sido guardado'});
            } else {
                res.status(200).send({album: albumStored});
            }
        }
    });
}

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    albumModel.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        } else{
            if(!albumUpdated){
                res.status(404).send({message: 'El album no existe'});
            } else{
                res.status(200).send({album: albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res){
    var albumId = req.params.id;

    albumModel.findByIdAndDelete(albumId, (err, albumRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el album'});
        } else{
            if(!albumRemoved){
                res.status(404).send({message: 'El album no ha sido eliminado'});
            } else{
                songModel.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
                    if(err){
                        res.status(500).send({message: 'Error al eliminar la canción'});
                    } else{
                        if(!songRemoved){
                            res.status(404).send({message: 'La canción no ha sido eliminada'});
                        } else{
                            res.status(200).send({album: albumRemoved});
                        }
                    } 
                });
            }
        } 
    });
}

function uploadImage(req, res){
    var albumId = req.params.id;
    var file_name = 'No subido...'

    if(req.files){

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; 

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jfif'){
            albumModel.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                if(!albumUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar el album'});
                } else{
                    res.status(200).send({album: albumUpdated});
                }
            });
        } else{
            res.status(200).send({message: 'Extensión del archivo no valida'})
        }

        console.log(ext_split);
    } else{
        res.status(200).send({message: 'No has subido ninguna imagen...'});
    }
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/albums/' + imageFile;
    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        } else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}


module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};