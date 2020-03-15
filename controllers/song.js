'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var songModel = require('../models/song');

function getSong(req, res){
    var songId = req.params.id;

    songModel.findById(songId).populate({path: 'album',
    populate: {
        path: 'artist',
        model: 'Artist'}).exec((err, song) => {
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        } else{
            if(!song){
                res.status(404).send({message: 'La canción no existe'});
            } else{
                res.status(200).send({song: song});
            }
        }
    });
}

function getSongs(req, res){
    var albumId = req.params.album;

    if(!albumId){
        var find = songModel.find({}).sort('number');
    } else {
        var find = songModel.find({album: albumId}).sort('number');
    }
    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        } else{
            if(!songs){
                res.status(404).send({message: 'No hay canciones'});
            } else{
                return res.status(200).send({ songs: songs });
            }
        }
    });
}

function saveSong(req, res){
    var song = new songModel();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;
    song.save((err, songStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar'})
        } else{
            if(!songStored){
                res.status(404).send({message: 'La canción no ha sido guardada'});
            } else {
                res.status(200).send({song: songStored});
            }
        }
    });
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    songModel.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al guardar la canción'});
        } else{
            if(!songUpdated){
                res.status(404).send({message: 'La canción no existe'});
            } else{
                res.status(200).send({song: songUpdated});
            }
        }
    });
}

function deleteSong(req, res){
    var songId = req.params.id;

    songModel.findByIdAndDelete(songId, (err, songRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al eliminar la canción'});
        } else{
            if(!songRemoved){
                res.status(404).send({message: 'La canción no ha sido eliminada'});
            } else{
                res.status(200).send({song: songRemoved});
            }
        } 
    });
}

function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'No subido...'

    if(req.files){

        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; 

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(file_ext == 'mp3' || file_ext == 'ogg'){
            songModel.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                if(!songUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar la canción'});
                } else{
                    res.status(200).send({song: songUpdated});
                }
            });
        } else{
            res.status(200).send({message: 'Extensión del archivo no valida'})
        }

        console.log(ext_split);
    } else{
        res.status(200).send({message: 'No has subido ninguna canción...'});
    }
}

function getSongFile(req, res){
    var songFile = req.params.songFile;
    var pathFile = './uploads/songs/' + songFile;
    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        } else{
            res.status(200).send({message: 'No existe la canción'});
        }
    });
}


module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};