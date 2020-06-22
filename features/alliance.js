'use strict'

const { url } = require('../utils/mongodb');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var internalErrors = require('../errors/internalErrors');
var messageFormatter = require('../utils/messageFormatter');

var AllianceSchema = require('../classes/alliance');

module.exports.editAllianceScore = async function editAllianceScore(message, args){
    try {
        const allianceName = args.shift().toLowerCase();
        if(!allianceName) {
            throw new internalErrors.BadInputParameters('alliance');
        }
        const atkWin = Number(args.shift());
        if(!atkWin) {
            throw new internalErrors.BadInputParameters('value');
        }
        const atkLoose = Number(args.shift());
        if(!atkLoose) {
            throw new internalErrors.BadInputParameters('value');
        }
        const defWin = Number(args.shift());
        if(!defWin) {
            throw new internalErrors.BadInputParameters('value');
        }
        const defLoose = Number(args.shift());
        if(!defLoose) {
            throw new internalErrors.BadInputParameters('value');
        }
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        var db = mongoose.connection;
        db.on('error', function() { 
            throw new internalErrors.DatabaseError('down');
        });
        db.once('open', async function() {
        const res = await AllianceSchema.findOneAndUpdate({ name: allianceName }, { valueAtkWin: atkWin, valueAtkLoose: atkLoose, valueDefWin: defWin, valueDefLoose: defLoose }, function(err, res) {
            if(err) {
            throw new internalErrors.DatabaseError('update');
            }
        });
        message.channel.send(messageFormatter.updateAllianceScore(allianceName.capitalize(), atkWin, atkLoose, defWin, defLoose));
        })
    } catch(err) {
        console.log(err.message);
        message.channel.send(messageFormatter.errorMessage(err));
    }
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}