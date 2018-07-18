const mongoose = require('mongoose')

//电影数据表结构
module.exports =new mongoose.Schema({
    name:String,
    englishname:String,
    alias:[String],
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MovieCategoryList'
    },
    showtime:Date,
    director:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Director'
    },
    price:Number,
    totalprice:Number,
    score:Number,
    plot:String,
    minute:Number,
    commentnum:{
        type:Number,
        default:0
    },
    ups:{
        type:Number,
        default:0
    },
    //预告片
    trailer:[String],
    //功能图
    vertical:String,
    horizontal:String,
    banner:String,
    //图集
    src:[String],
    newsnum:{
        type:Number,
        default:0
    },
    wantsee:{
        type:Number,
        default:0
    }


})

