const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors') // 引入跨域的包
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express()
app.use(cookieParser('mysession'));
app.use(session({
    name:'mycookie',
    secret: 'mysession',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true,
    cookie:{ path: '/', httpOnly: true, secure: false, maxAge: 7*24*60*60*1000}
}))

//连接服务器
mongoose.connect('mongodb://106.12.30.132:27017/register',function (err) {
    if (err){
        console.log('数据库连接失败')
    }
    console.log('connected')
    const server = app.listen(8000,function (err) {
        if (err){
            throw err.message
        }
        console.log('listening')
    });
})
//配置cors
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Access-Control-Allow-Credentials",true);
    next();
});

//静态文件路径
app.use('/public',express.static('public'))

//设置body-parser的参数
app.use(bodyParser.urlencoded({extended:true}))

//路由分发
app.use('/api',require('./routers/api'))//请求数据的接口
app.use('/admin',require('./routers/admin'))//后端数据操作的接口
app.use('/userinfo',require('./routers/user'))//用户数据操作的接口
app.use('/rank',require('./routers/rank'))//排行榜数据的接口


//人造数据
const movie = require('./model/movie')
const Users = require('./model/user')
const moviecategory = require('./model/newscategorylist')
const movieyear = require('./model/movieyearlist')
const rank = require('./model/rank')
const Bannerlist = require('./model/bannerlist');
const News = require('./model/news')



// movie.create({
//     name:'普罗米修斯',
//     englishname:'Promisuse',
//     showtime:Date.now(),
//     director:'5b077925e6e13c92ac56c623',
// },{
//
//     name:'阿凡达',
//         englishname:'Avatar',
//     showtime:Date.now(),
//     director:'5b077925e6e13c92ac56c624',
//
// })

//moviecategory.create({category:'时光策划'},{category:'时光对话'},{category:'全球拾趣'},{category:'电影'},{category:'音乐'},{category:'产业'},{category:'人物'})

///关于使用populate 一定要引入ref中模型！！！，随便取个变量名都行，但就是要引入

// const year = require('./model/movieyearlist')
// year.find().sort({time:1}).then(r=>{
//     console.log(r)
// })



//方法1 可以做更复杂的更新操作，可以返回指定字段
// let needinfo = {username:1, nickname:1, img:1, tags:1, exp:1, like:1,lastloading:1,registerdata:1}
// //更新用户最后登陆时间
// Users.findById("5afbef0e41fc4e1f78c7fab2",needinfo,function (err,doc) {
//
//     console.log('修改前',doc)
//
//     doc.lastloading =  Date.now();
//
//     doc.save();
//     console.log('修改后',doc)
//     console.log('time is',moment(doc.lastloading).format('YYYY-MM-DD HH:mm:ss'))
//
// })


//写法简单，注option参数New  设定后返回更新后的数据
// Users.findByIdAndUpdate('5afbef0e41fc4e1f78c7fab2',{lastloading:Date.now()},{ new: true })
//     .then(r=>{
//         console.log(r)
//     })

