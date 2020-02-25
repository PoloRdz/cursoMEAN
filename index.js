'use strict'

var mongoose = require('mongoose');
var app = require("./app");
var port = process.env.port || 3977;

mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) =>{
    if(err){
        throw err;
    } else {
        console.log("La base de datos se ha conectado correctamentes");

        app.listen(port, function(){
            console.log("Servidor del api rest de musica escuchando en http://localhost:" + port);
        });
    }
});