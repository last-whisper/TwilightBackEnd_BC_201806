const mongoose = require('mongoose')

//评论数据结构
module.exports =new mongoose.Schema({
    //评论用户
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    //新闻or电影评论
    commenttype:String,
    //是否是长条评论
    islongcomment:{
      type:Boolean,
      default:false
    },
    //内容
    comment:String,
    time:{
        type:Date,
        default:Date.now
    },
    //点赞数
    ups:{
        type:Number,
        default:0
    },
    //踩数
    disagree:{
        type:Number,
        default:0
    },
    ascription:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Movie'
    },

});