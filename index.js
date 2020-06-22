'use strict';

const express = require('express')
const app = express()

const { Client } = require('discord.js');
require('dotenv').config();

const PREFIX = '!'
const PREFIX_LENGTH = 1

// Utils
var messageFormatter = require('./utils/messageFormatter');

// Create an instance of a Discord client
const discordClient = new Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */

discordClient.on('ready', () => {
  console.log('I am ready!');
  const channel = discordClient.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
  channel.send(messageFormatter.startupMessage(process.env.npm_package_version));
});

// Create an event listener for messages
discordClient.on('message', async function(message) {
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
    await require('./features/match').addMatch(message, args);
  }
  if(command === 'stats') {
    await require('./features/stats').getPlayerStats(message, args);
  }
  if(command === 'alliance') {
    await require('./features/alliance').editAllianceScore(message, args);
  }
  if (command === 'help') {
    await require('./features/help').getHelp(message, args);
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
