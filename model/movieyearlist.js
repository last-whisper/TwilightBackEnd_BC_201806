const mongoose = require('mongoose')
const movieyearlist = require('../schema/movieyearlist')
module.exports = mongoose.model('MovieYearList',movieyearlist)