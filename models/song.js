'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album: {type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Song', songSchema);