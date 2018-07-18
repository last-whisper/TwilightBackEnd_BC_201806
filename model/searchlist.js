const mongoose = require('mongoose')
const searchlist = require('../schema/searchlist')
module.exports = mongoose.model('SearchList',searchlist)