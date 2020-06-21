'use strict'

const { url } = require('../utils/mongodb');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var internalErrors = require('../errors/internalErrors');
var messageFormatter = require('../utils/messageFormatter');

var AllianceSchema = require('../classes/alliance');

module.exports.editAllianceScore = async function editAllianceScore(message, args){
    try {
        const allianceName = args.shift();
        if(!allianceName) {
            throw new internalErrors.BadInputParameters('alliance');
        }
        const allianceValue = Number(args.shift());
        if(!allianceValue) {
            throw new internalErrors.BadInputParameters('value');
        }
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });
        var db = mongoose.connection;
        db.on('error', function() { 
            throw new internalErrors.DatabaseError('down');
        });
        db.once('open', async function() {
        const res = await AllianceSchema.findOneAndUpdate({ name: allianceName }, { value: allianceValue }, function(err, res) {
            if(err) {
            throw new internalErrors.DatabaseError('update');
            }
        });
        message.channel.send(messageFormatter.updateAllianceScore(allianceName, allianceValue));
        })
    } catch(err) {
        console.log(err.message);
        message.channel.send(messageFormatter.errorMessage(err));
    }
}