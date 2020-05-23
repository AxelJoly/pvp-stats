'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    name: { type: String , unique: true },
    guild: String
});

module.exports = mongoose.model('Player', PlayerSchema);