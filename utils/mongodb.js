'use strict'

require('dotenv').config();

module.exports.url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0-hebsv.mongodb.net/pvp-stats-${process.env.ENV}?retryWrites=true&w=majority`;