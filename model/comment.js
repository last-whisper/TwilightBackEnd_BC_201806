const mongoose = require('mongoose')
const comment = require('../schema/comment')
module.exports = mongoose.model('Comment',comment)