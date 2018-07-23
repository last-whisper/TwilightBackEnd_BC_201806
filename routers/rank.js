const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
//引入相关数据模型对象
const MainMenuList = require('../model/mainmenulist');
const SearchList = require('../model/searchlist');
const Movie = require('../model/movie');
const Director = require('../model/director');
const Rank = require('../model/rank');
const BannerList = require('../model/bannerlist');
const News = require('../model/news');
const NewsCategoryList = require('../model/newscategorylist');
const MovieCategoryList = require('../model/moviecategorylist');
const Advertisement = require('../model/advertisement');

//根据正在上映的影片的wantsee排列出(观影指南)暮光热度排行榜
router.get('/movieshotlist',function (req,res) {
    let today = moment().toISOString();
    let tmonthago = moment().subtract(60,'d').toISOString();
    let needinfo = {alias:0,ups:0,src:0,newsnum:0,wantsee:0,englishname:0,director:0,totalprice:0,banner:0};
    Movie.find({'$and':[{showtime:{'$gt':tmonthago}},{showtime:{'$lte':today}}]},needinfo)
        .populate('tag').sort({wantsee:-1})
        .then(r=>{
            res.json({data:r,code:0})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })
});
//电影票房排行，筛选条件:全部
router.post('/totalprice',function (req,res) {
    let limit = Number(req.body.limit) || 5000;
    let needinfo = {vertical:1,_id:1,score:1,name:1,totalprice:1,price:1};
    Movie.find({},needinfo)
        .sort({totalprice:-1}).limit(limit)
        .then(r=>{
            res.json({data:r,code:0});
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })
});
//电影票房排行，筛选条件：热映中
router.post('/totalprice-show',function (req,res) {
    let today = moment().toISOString();
    let limit = Number(req.body.limit) || 5000;
    let afterhalfyear = moment().add(6,'M').toISOString();
    let needinfo = {vertical:1,_id:1,score:1,name:1,totalprice:1,price:1};
    Movie.find({'$and':[{showtime:{'$gt':today}},{showtime:{'$lte':afterhalfyear}}]},needinfo)
        .sort({totalprice:-1}).limit(limit)
        .then(r=>{
            res.json({data:r,code:0});
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })
});

//电影票房排行，筛选条件：今年上映的影片
router.post('/totalprice-year',function (req,res) {
    let today = moment().toISOString();
    let limit = Number(req.body.limit) || 5000;
    let year = moment().startOf('year').toISOString();
    let needinfo = {vertical:1,_id:1,score:1,name:1,totalprice:1,price:1};
    Movie.find({'$and':[{showtime:{'$gt':year}},{showtime:{'$lte':today}}]},needinfo)
        .sort({totalprice:-1}).limit(limit)
        .then(r=>{
            res.json({data:r,code:0});
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })
});


module.exports = router;