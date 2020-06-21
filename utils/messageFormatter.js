'use strict';

const { MessageEmbed } = require('discord.js');
const features = require('./features.json').features;

module.exports.matchAdded = function matchAdded(scenario, status, alliance, players) {
  const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle('Match ajouté!')
      // Set the color of the embed
      .setColor(0x359d08)
      // Set the main content of the embed
      .setDescription(`**Alliance:** ${alliance.toUpperCase()}\n **Status:** ${scenario.toUpperCase()} ${status.toUpperCase()}\n **Equipe:**\n${beautifulTeam(players)}`);
    // Send the embed to the same channel as the message
    return embed;
}
  
module.exports.playerStats =  function playerStats(player, wins, looses, score) {
    const embed = new MessageEmbed()
    var total = Math.round(100*wins/(wins+looses), 1) + '%'
    embed.setTitle(`**${player.name}**`)
          .setColor(0x359d08)
          .setDescription(`**Score:** ${score} point(s)\n**Victoires:** ${wins}\n**Défaites:** ${looses}\n**Ratio:** ${total}`);
    return embed;
}

module.exports.errorMessage = function errorMessage(error) {
  const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(error.name)
      // Set the color of the embed
      .setColor(0xd20000)
      // Set the main content of the embed
      .setDescription(error.message);
    // Send the embed to the same channel as the message
    return embed;
}

module.exports.startupMessage = function startupMessage(version) {
  const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`Pvp Stats Bot Update! 🍻`)
      // Set the color of the embed
      .setColor(0x0072f2)
      // Set the main content of the embed
      .setDescription(`**Version:** ${version}\n **Link to update:** https://github.com/AxelJoly/pvp-stats/commits/master`);
    // Send the embed to the same channel as the message
    return embed;
}

module.exports.updateAllianceScore = function updateAllianceScore(name, score) {
  const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`Score enregistré!`)
      // Set the color of the embed
      .setColor(0x0072f2)
      // Set the main content of the embed
      .setDescription(`**Alliance:** ${name}\n **Score:** ${score}`);
    // Send the embed to the same channel as the message
    return embed;
}

module.exports.helpMessage = function helpMessage(feature) {
  const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`Helping Tools`)
      // Set the color of the embed
      .setColor(0x0072f2)
      // Set the main content of the embed
      .setDescription(featureHelper(feature));
    // Send the embed to the same channel as the message
    return embed;
}

function beautifulTeam(players) {
  var team = ''
  players.forEach(player => {
    team = team + '*' + player.name + '*\n'
  });
  return team;
}

function featureHelper(featureName){
  if(featureName) {
    const feature = features.find(feature => feature.name === featureName)
    return `**!${feature.name}**\n${feature.usage}\n${feature.command}`
  }
  var message = '';
  features.forEach(feature => {
    message = message + `**!${feature.name}**\n${feature.usage}\n${feature.command}\n\n`
  })
  return message;
}

