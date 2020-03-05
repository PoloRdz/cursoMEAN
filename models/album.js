'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumSchema = Schema({
    title: String,
    description: String,
    image: String,
    year: Number,
    artist: {type: Schema.ObjectId, ref:'Artist'}
});

module.exports = mongoose.model('Album', albumSchema);