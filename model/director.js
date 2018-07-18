const mongoose = require('mongoose')
const director = require('../schema/director')
module.exports = mongoose.model('Director',director)