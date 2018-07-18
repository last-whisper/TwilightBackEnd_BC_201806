const mongoose = require('mongoose')
const advertisement = require('../schema/advertisement')
module.exports = mongoose.model('Advertisement',advertisement)