const mongoose = require('mongoose')
const mainmenulist = require('../schema/mainmenulist')
module.exports = mongoose.model('MainMenuList',mainmenulist)