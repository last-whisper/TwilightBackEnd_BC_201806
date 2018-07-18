const mongoose = require('mongoose')

//排行榜数据结构
module.exports =new mongoose.Schema({
    title:String,
    introduce:String,
    time:{
        type:Date,
        default:Date.now
    },
    list:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Movie'
    }]
})