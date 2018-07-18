const mongoose = require('mongoose')
const newscategorylist = require('../schema/newscategorylist')
module.exports = mongoose.model('NewsCategoryList',newscategorylist)