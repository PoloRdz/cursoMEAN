'use strict'

var mongoose = require('mongoose');
var app = require("./app");
var port = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://apiUsr:Amonos123@cluster0-ycxpl.mongodb.net/test?retryWrites=true&w=majority', (err, res) =>{
    if(err){
        throw err;
    } else {
        console.log("La base de datos se ha conectado correctamente");

        app.listen(port, function(){
            console.log("Servidor del api rest de musica escuchando en http://localhost:" + port);
        });
    }
});
