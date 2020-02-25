'use strict'

var userModel = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

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
                res.status(400).send({message: 'El usuario no existe'});

            } else{
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        if(params.gethash){
                            res.status(200).send({
                                token: jwt.createToke(user)
                            });
                        } else{
                            res.status(200).send({user});
                        }
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

    userModel.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
        } else{
            if(!userUpdated){
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            } else{
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido...';
    if(req.files){
        var file_path = req.files.image.path;

        console.log(file_path);
    } else{
        res.status(200).send({message: 'No has subido ninguna imagen...'});
    }
}

module.exports = {
    pruebas,
    saveUser,
    login, 
    updateUser,
    uploadImage
};