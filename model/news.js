const mongoose = require('mongoose')
const news = require('../schema/news')
module.exports = mongoose.model('News',news)