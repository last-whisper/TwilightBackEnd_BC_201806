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
mongoose.connect('mongodb://localhost:27017/register',function (err) {
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




