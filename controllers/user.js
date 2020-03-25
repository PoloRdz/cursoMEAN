'use strict'

var userModel = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function pruebas(req, res){
    res.status(200).send({
        message: 'Probando una accion del controlador de usaurios del api con Node Y Mongo'
    });
}

function saveUser(req, res){
    var user = new userModel();
    var params = req.body;
    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email.toLowerCase();
    user.role = 'ROLE_USER';
    user.image = null;

    if(params.password){
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if(user.name != null && user.surname != null && user.email != null){
                //Guardar
                user.save((err, userStored) => {
                    if(err){
                        res.status(500).send({message:'Error al guardar usuario'});
                    } else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        } else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            } else{
                res.status(500).send({message:'Rellena todos los campos'});
            }
        });
    } else{
        res.status(500).send({message: 'Introduce la contraseña'});
    }
}

function login(req, res){
    var user = new userModel();
    var params = req.body;

    var email = params.email;
    var password = params.password;

    userModel.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message:'Error en la peticion'});
        } else{
            if(!user){
                res.status(404).send({message: 'El usuario no existe'});
            } else{
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        res.status(200).send({
                            user: user,
                            token: jwt.createToken(user)
                        });
                    } else{
                        res.status(404).send({message: 'Contraseña incorrecta'});
                    }
                });
            }
        }
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
    }

    userModel.findByIdAndUpdate(userId, update).then(function(userUpdated){
        res.status(200).send({user: userUpdated});
    })
    .catch(function(err){
        res.status(500).send({message: 'Error al actualizar el usuario'});
    });
}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = '';
    if(req.files){

        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; 

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jfif'){
            userModel.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                if(!userUpdated){
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                } else{
                    res.status(200).send({image: file_name, user: userUpdated});
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
    var pathFile = './uploads/users/' + imageFile;
    fs.exists(pathFile, function(exists){
        if(exists){
            res.sendFile(path.resolve(pathFile));
        } else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}

module.exports = { 
    pruebas,
    saveUser,
    login, 
    updateUser,
    uploadImage,
    getImageFile
};