const mongoose = require('mongoose')

//用户数据结构
module.exports =new mongoose.Schema({
    list:[{
        navname:String,
        link:String,
        tag:{type:String,default:''}
    }]
})

