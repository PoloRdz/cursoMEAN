'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var artistModel = require('../models/artist');
var albumModel = require('../models/album');
var songModel = require('../models/song');

function getAlbum(req, res){
    var albumId = req.params.id;

    albumModel.findById(albumId, (err, album) => {
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
    if(req.params.page){
        var page = req.params.page;
    } else{
        var page = 1;
    }
    
    var itemsPerPage = 3;

    albumModel.find().sort('title').paginate(page, itemsPerPage, function(err, albums, total){
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        } else{
            if(!albums){
                res.status(404).send({message: 'No hay albums'});
            } else{
                return res.status(200).send({
                    total_items: total,
                    albums: albums
                });
            }
        }
    });
}

function saveAlbum(req, res){
    var album = new albumModel();

    var params = req.body;
    album.title = params.name;
    album.description = params.description;
    album.image = 'null';
    album.year = params.year;

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

function updateArtist(req, res){
    var artistId = req.params.id;
    var update = req.body;

    artistModel.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        } else{
            if(!artistUpdated){
                res.status(404).send({message: 'Esl artista no existe'});
            } else{
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res){
    var artistId = req.params.id;

    artistModel.findByIdAndRemove(artistId,  (err, artistRemoved) => {
        if(err){
            res.status(500).send({message: 'Error al eliminar el artista'});
        } else{
            if(!artistRemoved){
                res.status(404).send({message: 'El artista no ha sido eliminado'});
            } else{
                albumModel.find({artist: artistRemoved._id}).remove((err, albumRemoved)=>{
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
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                } 
                            });
                        }
                    } 
                });
            }
        }
    });
}

function uploadImage(req, res){
    var artistId = req.params.id;
    var file_name = 'No subido...'

    if(req.files){

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; 

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jfif'){
            artistModel.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
                if(!artistUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar el artista'});
                } else{
                    res.status(200).send({artist: artistUpdated});
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
    var pathFile = './uploads/artists/' + imageFile;
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
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};