'use strict';

const { MessageEmbed } = require('discord.js');

module.exports.matchAdded = function matchAdded(scenario, status, alliance, players){
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

function beautifulTeam(players){
    var team = ''
    players.forEach(player => {
      team = team + '*' + player.name + '*\n'
    });
    return team;
}
  
module.exports.playerStats =  function playerStats(player){
    const embed = new MessageEmbed()
  
    if(player){
      var total = Math.round(100*player.win/(player.win+player.loose), 1) + '%'
      embed.setTitle(`**${player.name}**`)
            .setColor(0x359d08)
            .setDescription(`**Victoires:** ${player.win}\n **Défaites:** ${player.loose}\n**Ratio:** ${total}`);
    } else {
      embed.setTitle('**Player inconnu**')
      .setColor(0xd20000)
      .setDescription('Impossible de récupérer les données.');
    } 
      return embed;
}

module.exports.errorMessage = function errorMessage(error){
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

module.exports.startupMessage = function startupMessage(version, body, commitedOn){
  const embed = new MessageEmbed()
      // Set the title of the field
      .setTitle(`Pvp Stats Bot v${version}`)
      // Set the color of the embed
      .setColor(0x0072f2)
      // Set the main content of the embed
      .setDescription(`**Latest version deployed on:** ${commitedOn}\n **Features:** ${body}`);
    // Send the embed to the same channel as the message
    return embed;
}
