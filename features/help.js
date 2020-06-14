'use strict'

var messageFormatter = require('../utils/messageFormatter');

module.exports.getHelp = async function getHelp(message, args){
    const feature = args.shift();
    if(feature){
      message.channel.send(messageFormatter.helpMessage(feature));
    }else {
      message.channel.send(messageFormatter.helpMessage());
    }
}