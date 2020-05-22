'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchSchema = new Schema({
    date: Date,
    scenario: String,
    status: String,
    alliance: String,
    players:[
      { type: Schema.Types.ObjectId, ref: 'Player' }
    ]
});

module.exports = mongoose.model('Match', MatchSchema);