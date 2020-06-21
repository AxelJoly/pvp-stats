'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MatchSchema = new Schema({
    date: Date,
    scenario: String,
    status: String,
    alliance: { type: Schema.Types.ObjectId, ref: 'Alliance' },
    players: [
      { type: Schema.Types.ObjectId, ref: 'Player' }
    ]
});

module.exports = mongoose.model('Match', MatchSchema);