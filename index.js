'use strict'

var mongoose = require('mongoose');
var app = require("./app");
var port = process.env.port || 80;

mongoose.connect('mongodb://apiUsr:Amonos123@cluster0-ycxpl.mongodb.net/test?retryWrites=true&w=majority', (err, res) =>{
    if(err){
        throw err;
    } else {
        console.log("La base de datos se ha conectado correctamente");

        app.listen(port, function(){
            console.log("Servidor del api rest de musica escuchando en http://localhost:" + port);
        });
    }
});
