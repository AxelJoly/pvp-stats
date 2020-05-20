'use strict';

const { MessageEmbed } = require('discord.js');

module.exports.matchAdded = function matchAdded(status, alliance, players){
  const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle('Match successfully added!')
      // Set the color of the embed
      .setColor(0x359d08)
      // Set the main content of the embed
      .setDescription(`**Opponent:** ${alliance.toUpperCase()}\n **Status:** ${status.toUpperCase()}\n **Team Members:**\n${beautifulTeam(players)}`);
    // Send the embed to the same channel as the message
    return embed;
}

function beautifulTeam(players){
    var team = ''
    players.forEach(player => {
      team = team + '*' + player.name + '*\n'
    });
    return team;
}
  
module.exports.playerStats =  function playerStats(player){
    var total = Math.round(100*player.win/(player.win+player.loose), 1) + '%'
    const embed = new MessageEmbed()
        // Set the title of the field
        .setTitle(`**${player.name}**`)
        // Set the color of the embed
        .setColor(0x359d08)
        // Set the main content of the embed
        .setDescription(`**Wins:** ${player.win}\n **Looses:** ${player.loose}\n**Winrate:** ${total}`);
      // Send the embed to the same channel as the message
      return embed;
}