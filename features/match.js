'use strict'

const { url } = require('../utils/mongodb');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var internalErrors = require('../errors/internalErrors');
var messageFormatter = require('../utils/messageFormatter');

var MatchSchema = require('../classes/match');
var PlayerSchema = require('../classes/player');
var AllianceSchema = require('../classes/alliance');

module.exports.addMatch = async function addMatch(message, args){
    try{
        const scenario = formatToLowerCase(args.shift());
        if(scenario != 'def' && scenario != 'atk') {
            throw new internalErrors.BadInputParameters('scenario')
        }
        
        const status = formatToLowerCase(args.shift());
        if(status != 'win' && status != 'loose') {
            throw new internalErrors.BadInputParameters('status')
        }
  
        const alliance = formatToLowerCase(args.shift());
        if(!alliance) {
            throw new internalErrors.BadInputParameters('alliance')
        }

        const playerNames = args;
        if(playerNames.length < 1 || playerNames.length > 5) {
            throw new internalErrors.BadInputParameters('length')
        }
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        var db = mongoose.connection;
        db.on('error', function(){
            throw new internalErrors.DatabaseError('down');
        });
  
        db.once('open', async function() {
          // Verify if players already exists or need to create them.
          var players = await PlayerSchema.find().where('name').in(playerNames);
          for (const playerName of playerNames) {
            if (!players.some(item => item.name === playerName)){
              const player = await new PlayerSchema({ name: playerName, guild: process.env.GUILD, win: 0, loose: 0 }).save();
              if(!player) {
                throw new internalErrors.DatabaseError('update');
              }
              players.push(player);
            }
          };
          var allianceFound = await AllianceSchema.find({ name: alliance });
          console.log(allianceFound.length);
          if(allianceFound.length == 0) {
            allianceFound[0] = await new AllianceSchema({ name: alliance, valueAtkWin: 0.5, valueAtkLoose: 0, valueDefWin: 1, valueDefLoose: 0.5 }).save();
          }
          const match = await new MatchSchema({ date: new Date(), scenario: scenario, status: status, alliance: allianceFound[0], players: players }).save();
          if(!match) {
            throw new internalErrors.DatabaseError('update');
          }
          const res = await PlayerSchema.updateMany({ name: playerNames }, { $inc: { [status]: 1 } },function(err, res) {
            if(err) {
              throw new internalErrors.DatabaseError('update');
            }
          });
          console.log('Matched: ' + res.n);
          console.log('Updated: ' + res.nModified)
          message.channel.send(messageFormatter.matchAdded(scenario, status, alliance, players));
        });  
      } catch(err) {
        console.log(err.message);
        message.channel.send(messageFormatter.errorMessage(err));
      }
}

function formatToLowerCase(string) {
    if(string) {
        return string.toLowerCase();
    }
    return null;
  }