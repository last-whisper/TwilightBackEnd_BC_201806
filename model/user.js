const mongoose = require('mongoose')
const users = require('../schema/user')
module.exports = mongoose.model('Users',users)