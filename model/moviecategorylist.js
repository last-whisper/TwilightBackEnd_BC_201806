const mongoose = require('mongoose')
const moviecategorylist = require('../schema/moviecategorylist')
module.exports = mongoose.model('MovieCategoryList',moviecategorylist)