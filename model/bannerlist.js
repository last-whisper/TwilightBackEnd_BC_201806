const mongoose = require('mongoose');
const bannerlist = require('../schema/bannerlist');
module.exports = mongoose.model('BannerList',bannerlist);