const mongoose = require('mongoose')

//banner数据结构
module.exports =new mongoose.Schema({
    data:[{src:{
        type:String,
        default:''
    },
    link:{
        type:String,
        default:''
    }}]

})