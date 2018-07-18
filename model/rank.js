const mongoose = require('mongoose')
const rank = require('../schema/rank')
module.exports = mongoose.model('Rank',rank)