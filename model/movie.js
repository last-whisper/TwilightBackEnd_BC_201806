const mongoose = require('mongoose')
const movie = require('../schema/movie')
module.exports = mongoose.model('Movie',movie)