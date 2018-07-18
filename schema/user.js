const mongoose = require('mongoose')

//用户数据结构
module.exports =new mongoose.Schema({
    username:String,
    password:String,
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Movie'
    }],
    isAdmin:{
        type:Boolean,
        default:false
    },
    exp:{
        type:Number,
        default:0 //经验值
    },
    nickname:{
        type:String,
        default:'未设置昵称'
    },
    registerdata:{//注册日
        type:Date,
        default:Date.now
    },
    lastloading:{//最后一次登陆时间
        type:Date,
        default:Date.now
    },
    tags:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MovieCategoryList'
    }],
    img:{
        type:String,
        default:''
    },
    //用户账号少，用户评论记录需求移除
    mycomment:{
        moviecomment:[{
            type:mongoose.Schema.Types.ObjectId,
        }],
        newscomment:[{
            type:mongoose.Schema.Types.ObjectId,
        }]
    },
    wish:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Movie'
    }]

})


