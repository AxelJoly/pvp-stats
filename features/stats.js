'use strict'

const { url } = require('../utils/mongodb');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var internalErrors = require('../errors/internalErrors');
var messageFormatter = require('../utils/messageFormatter');

var MatchSchema = require('../classes/match');
var PlayerSchema = require('../classes/player');
var AllianceSchema = require('../classes/alliance');

module.exports.getPlayerStats = async function getPlayerStats(message, args){
try {
    const playerName = args.shift();
    console.log(playerName);
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    var db = mongoose.connection;
    db.on('error', function() { 
        throw new internalErrors.DatabaseError('down');
    });
    db.once('open', async function() {
        var player = await PlayerSchema.where({name: playerName}).findOne(
        function(err, res) {
            if(err) {
            throw new internalErrors.DatabaseError('update');
            }
        });
        
        if(player){
            var matchs = await MatchSchema.where({"players": player._id}).find().populate("alliance").exec();
        
        var wins = 0;
        var looses = 0;
        var score = 0;

        matchs.forEach(match => {
            if(match.status == 'win') {
                wins++;
                if(match.scenario == 'def') {
                    score = score + match.alliance.valueDefWin;
                } else {
                    score = score + match.alliance.valueAtkWin;
                }
            } else {
                looses++;
                if(match.scenario == 'def') {
                    score = score + match.alliance.valueDefLoose;
                } else {
                    score = score + match.alliance.valueAtkLoose;
                }
            }
        })
            message.channel.send(messageFormatter.playerStats(player, wins, looses, score));
        } else {
            message.channel.send(messageFormatter.errorMessage({name:"Joueur inconnu", message:"Impossible de récupérer les données."}));
        }
    });
    }
    catch(err) {
        console.log(err.message);
        message.channel.send(messageFormatter.errorMessage(err));
    }
}