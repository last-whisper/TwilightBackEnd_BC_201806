const mongoose = require('mongoose')
const moviecountrylist = require('../schema/moviecountrylist')
module.exports = mongoose.model('MovieCountryList',moviecountrylist)