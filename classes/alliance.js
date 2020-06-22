'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AllianceSchema = new Schema({
    name: { type: String , unique: true },
    valueAtkWin: Number,
    valueDefWin: Number,
    valueAtkLoose: Number,
    valueDefLoose: Number
});

module.exports = mongoose.model('Alliance', AllianceSchema);