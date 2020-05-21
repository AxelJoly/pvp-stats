'use strict';


const express = require('express')
const app = express()

const { Client } = require('discord.js');
require('dotenv').config();

const PREFIX = '!'
const PREFIX_LENGTH = 1

// MongoDB Models
var MatchSchema = require('./classes/match');
var PlayerSchema = require('./classes/player');

// Message Formatter
var messageFormatter = require('./utils/messageFormatter');

// Create an instance of a Discord client
const discordClient = new Client();

var mongoose = require('mongoose');
var url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0-hebsv.mongodb.net/pvp-stats-${process.env.ENV}?retryWrites=true&w=majority`;

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
discordClient.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
discordClient.on('message', function(message) {
  /**
   *  FORMAT: (WIN|LOOSE) (ALI) [JOUEUR1, ..., JOUEUR5]
   *  EXAMPLE: WIN UNEX Haltahiz Shintai
   */ 

  // Ignore self message
  if(message.author.bot) return;

  // Verify ! as first character
  if(message.content.indexOf(PREFIX) !== 0) {
    return;
  }

  const args = message.content.slice(PREFIX_LENGTH).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  console.log('Invocked command: ' + command);
  
  if (command === 'match') {
    try{
      const status = args.shift().toLowerCase();
      const alliance = args.shift().toLowerCase();
      const playerNames = args;
      mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
      var db = mongoose.connection;
      db.on('error', function(){
        message.channel.send(messageFormatter.errorMessage({name: "**Database not reachable**", message: "Please try again later."}));
        return;
      });
      db.once('open', async function() {
        var players = await PlayerSchema.find().where('name').in(playerNames);
        playerNames.forEach(async playerName => {
          if(!players.some(item => item.name === playerName)){
            const player = new PlayerSchema({ name: playerName, guild: 'Atom', win: 0, loose: 0 });
            players.push(player);
            await player.save();    
          }
        });
        const match = new MatchSchema({ status: status, alliance: alliance, players:players });
        await match.save();

        var matchValue;
        if(status.match('win')){
          matchValue = 'win';
        } else if(status.match('loose')){
          matchValue = 'loose';
        }else {
          message.channel.send('Failed');
          return;
        }
        console.log(matchValue);
        const res = await PlayerSchema.updateMany({ name: playerNames }, { $inc: { [matchValue]: 1 }});
        console.log('Matched: ' + res.n);
        console.log('Updated: ' + res.nModified)
        message.channel.send(messageFormatter.matchAdded(status, alliance, players));
      });  
    } catch(err) {
      console.log(err.message);
      message.channel.send(messageFormatter.errorMessage(err));
    }
  }
  if(command === 'stats') {
    try {
      const playerName = args.shift();
      console.log(playerName);
      mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});
      var db = mongoose.connection;
      db.on('error', function(){ 
        message.channel.send(messageFormatter.errorMessage({name: "**Database not reachable**", message: "Please try again later."})); 
        return;
      });
      db.once('open', async function() {
        var player = await PlayerSchema.where({name: playerName}).findOne();
        message.channel.send(messageFormatter.playerStats(player));    
      });
    }
    catch(err) {
      console.log(err.message);
      message.channel.send(messageFormatter.errorMessage(err));
    }
  }
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
discordClient.login(process.env.DISCORD_TOKEN);

app.get('/', function (req, res) {
  res.send(`PvP Stats Bot ${process.env.ENV}`)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})
