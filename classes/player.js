'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    name: String,
    guild: String,
    win: Number,
    loose: Number
});

module.exports = mongoose.model('Player', PlayerSchema);