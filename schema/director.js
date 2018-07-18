const mongoose = require('mongoose')

//导演数据结构
module.exports =new mongoose.Schema({
    transliteration:String,//音译中文名
    name:String,
    src:String
})