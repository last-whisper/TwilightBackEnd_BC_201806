
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//引入相关数据模型对象
const Users = require('../model/user')
const Movie = require('../model/movie')
const MovieCategoryList = require('../model/moviecategorylist')

//用户登陆验证
router.post('/login',function (req,res) {

    //需要返回的用户信息字段
    let needinfo = {_id:1,username:1, nickname:1, img:1, tags:1, exp:1, like:1,lastloading:1,isAdmin:1}

    //预定义返回客户端的登陆结果
    let loginResult = {
        message:'登陆成功',
        code:0,
        userinfo:{
            username:'',
            img:'',
            _id:''
        } //用户详细信息,需要这两个空字段
    }


    //session验证成功
    if(req.session.userId){

        //筛选用户数据
        Users.findById(req.session.userId._id,needinfo)
            .populate([{
            path: 'tags',
            select: '-__v',
            options: {sort: {'_id': -1},limit:3}
        },{
            path: 'wish',
            select: 'name',
            options: {sort: {'_id': -1},limit:2}
        }])
            .then(r=>{

            //将数据存到预定义的登陆结果中
            loginResult.userinfo = r;

            //更新用户登陆时间
            Users.findByIdAndUpdate(req.session.userId._id,{lastloading:new Date()},function (err,doc) {
                //返回数据
                res.json(loginResult)
            })
        })

    }else {
        //使用账号密码进行登陆验证

        Users.findOne({//筛选用户数据
            username:req.body.username,
            password:req.body.password
        },needinfo).populate([{
            path: 'tags',
            select: '-__v',
            options: {sort: {'_id': -1},limit:3}
        },{
            path: 'like',
            select: '-__v -alias',
            options: {sort: {'_id': -1},limit:2}
        }])
            .then(r=>{

                if (!r){

                    loginResult.code=1;
                    loginResult.message='用户名或密码错误';
                    res.json(loginResult)

                }else {

                    //登陆成功设置session
                    req.session.userId = {_id:r._id}//将用户的_id存在session中
                    //将数据存到预定义的登陆结果中
                    loginResult.userinfo = r;
                    //更新用户最后登陆时间
                    Users.findByIdAndUpdate(r._id,{lastloading:new Date()},function (err,doc) {
                        res.json(loginResult)
                    })

                }
            })
            .catch(err=>{
                //捕获错误如何处理
            })
    }
})

//用户安全退出
router.get('/loginout',function (req,res) {

    req.session.destroy(err=>{
        if(err){
            res.json({code:1, message:'退出失败'})
        }else {
            res.json({code:0, message:'安全退出成功'})
        }
    })

})

//用户注册帐户名先行验证
router.post('/register/username',function (req,res) {
    Users.findOne({username:req.body.username})
        .then(r=>{
            if (r){//用户名已被注册
                res.json({code:1})
            }else {//该用户名可用
                res.json({code:0})
            }
        })
})

//用户注册
router.post('/register',function (req,res) {
    if (req.body){
        const registerResult = {
            code:0,
            message:'恭喜您注册成功！'
        }
        //验证用户名是否存在
        Users.findOne({username:req.body.username})
            .then(r=>{
                if (r){

                    registerResult.code = 1;
                    registerResult.message = '抱歉~该用户名已被注册咯~';
                    res.json(registerResult)

                }else {

                    Users.create(req.body)
                        .then(r=>{
                            if (!r){

                                registerResult.code = 2;
                                registerResult.message = '出错啦，再试一次';
                                res.status(500).json(registerResult)

                            }else {

                                //注册成功后设置session
                                req.session.userId = {_id:r._id};
                                res.json(registerResult)

                            }
                        })
                        .catch(err=>{

                        })

                }
            })


    }

})


module.exports = router;