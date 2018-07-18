const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const moment = require('moment');//日期处理类库
const crypto = require('crypto');//md5加密模块
const multer = require('multer');//上传文件的中间件
//引入相关数据模型对象
const NewsCategoryList = require('../model/newscategorylist');
const MovieCategoryList = require('../model/moviecategorylist');
const Movie = require('../model/movie');
const Director = require('../model/director');
const News = require('../model/news');
const MainMenu = require('../model/mainmenulist');
const Rank = require('../model/rank');
const Adv = require('../model/advertisement');
const BannerList = require('../model/bannerlist');
const User = require('../model/user');

//文件夹验证
function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}


//配置文件存储参数
let storage = multer.diskStorage({//磁盘存储文件
    destination(req,file,cb){

        let reg = /\.[^\\.\/]+/ig;
        let suffix = file.originalname.match(reg).pop()//文件后缀名
        if(suffix==='.mp4'){
            if (!fsExistsSync('./public/videos')){
                fs.mkdirSync('./public/videos')
            }
            cb(null,'./public/videos')
        }else {
            if (!fsExistsSync('./public/images')){
                fs.mkdirSync('./public/images')
            }
            cb(null,'./public/images')
        }
    },
    filename(req,file,cb){
        let reg = /\.[^\\.\/]+/ig;
        let suffix = file.originalname.match(reg).pop()//文件后缀名
        let md5 = crypto.createHmac('md5',Math.random().toString() ).update(Date.now().toString()).digest('hex');
        if(suffix==='.mp4'){
            cb(null,'video-'+md5+suffix)//视频最终文件名
        }else {
            cb(null,'pic-'+md5+suffix)//图片最终文件名
        }

    }
})
//配置文件上传参数
let upload = multer({
    storage,
    limits:{
        fileSize:100*1000*1024
    },
    fileFilter(req,file,cb){
        let allow = ['image/gif','image/jpeg','image/bmp','image/png','video/mp4']
        if (allow.find((i)=>i===file.mimetype)){
            cb(null,true)
        }else {
            cb(null,false)
        }
    }
});

//配置新增用户的头像
let userpic = upload.single('avatar');
router.post('/userpic',userpic,function (req,res) {
    let src = '/public/images/'+req.file.filename;
   User.findById(req.body.id,function (err,doc) {
       doc.img = src;
       doc.save();
       res.json({code:0})
   })
});

//修改用户昵称
router.post('/usernickname',function (req,res) {
    User.findById(req.body.user,function (err,doc) {
        doc.nickname = req.body.nickname;
        doc.save();
        res.json({code:0,message:'修改成功'})
    })
})

//配置新增影片files参数
let cpUpload = upload.fields([
    {name:'avatar',maxCount:9},//图集
    {name:'vertical',maxCount:1},//竖封面图
    {name:'horizontal',maxCount:1},//横封面图
    {name:'banner',maxCount:1},//banner图
    {name:'videos',maxCount:100},//预告片
    {name:'directorsrc',maxCount:1}//导演相片
]);


//添加影片信息
router.post('/addmovie',cpUpload,function (req,res) {
    //影片别名
    let alias = [];
    if(req.body.alias){
        alias = req.body.alias.split(' ')
    }
    //预告片路径
    let trailer = [];
    if(req.files['videos']){
        req.files['videos'].forEach(i=>{trailer.push('/public/videos/'+i.filename)});
    }
    //图集路径
    let src = [];
    if(req.files['avatar']){
        req.files['avatar'].forEach(i=>{src.push('/public/images/'+i.filename)});
    }
    //总票房
    let totalprice = 0;
    if(Number(req.body.totalprice)) totalprice=Number(req.body.totalprice);
    //导演
    if(req.body.director){
        //不需要新增导演
        let director = req.body.director;
        Movie.create({
            name:req.body.name,
            englishname:req.body.englishname,
            alias,
            tag:req.body.currentCategory,
            showtime:req.body.showtime,
            director,
            price:Number(req.body.price),
            totalprice:totalprice,
            score:Number(req.body.score),
            plot:req.body.plot,
            minute:Number(req.body.min),
            trailer,
            horizontal:'/public/images/'+req.files['horizontal'][0].filename,
            vertical:'/public/images/'+req.files['vertical'][0].filename,
            banner:'/public/images/'+req.files['banner'][0].filename,
            src
        }).then((r)=>{
            res.json({code:0,message:'添加成功'})
        }).catch((err)=>{
            res.json({code:1,message:'添加失败'})
        })
    }else {
        Director.create({
            transliteration:req.body.transliteration,//音译中文名
            name:req.body.directorname,
            src:'/public/images/'+req.files['directorsrc'][0].filename
        }).then(r=>{
            Movie.create({
                name:req.body.name,
                englishname:req.body.englishname,
                alias,
                tag:req.body.currentCategory,
                showtime:req.body.showtime,
                director:r._id,
                price:Number(req.body.price),
                totalprice:totalprice,
                score:Number(req.body.score),
                plot:req.body.plot,
                minute:Number(req.body.min),
                trailer,
                horizontal:'/public/images/'+req.files['horizontal'][0].filename,
                vertical:'/public/images/'+req.files['vertical'][0].filename,
                banner:'/public/images/'+req.files['banner'][0].filename,
                src
            })
        }).then(()=>{
            res.json({code:0,message:'添加成功'})
        }).catch((err)=>{
            console.log(err);
            res.json({code:1,message:'添加失败'})
        })
    }
});

//配置新增新闻files参数
let newsUpload = upload.fields([
    {name:'avatar',maxCount:9},//新闻图集
    {name:'videos',maxCount:1},//新闻视频
    {name:'previewimg',maxCount:1},//新闻缩略图
]);

//添加新闻信息
router.post('/addnews',newsUpload,function (req,res) {
    let img = '';
    if(req.files['previewimg']){
        img = '/public/images/'+req.files['previewimg'][0].filename
    }
    let src = [];
    if(req.files['avatar']){
        req.files['avatar'].forEach(i=>{
            if (i){
                src.push('/public/images/'+i.filename)
            }
        });
    }
    let trailer = '';
    if(req.files['videos']){
        trailer = '/public/videos/'+req.files['videos'][0].filename
    }
    News.create({
        category:req.body.currentCategory,
        model:req.body.model,
        title:req.body.title,
        subtitle:req.body.subtitle,
        movie:req.body.movie,
        author:req.body.author,
        newscon:req.body.newscon,
        tag:req.body.tag,
        keyword:req.body.keyword.split(' '),
        img,
        src,
        trailer
    })
        .then(()=>{
            Movie.findById(req.body.movie,function (err,doc) {
                doc.newsnum += 1;
                doc.save()
            });
         })
        .then(()=>{
            res.json({code:0,message:'添加成功'})
        })
        .catch((err)=>{
            console.log(err);
         res.json({code:1,message:'添加失败'})
        })

});

//修改主导航信息
router.post('/changemainmenu',function (req,res) {
    MainMenu.findOne({},function (err,doc) {
        doc.list = Array.from(req.body);
        doc.save();
    }).then(()=>{
        res.json({code:0,message:'修改成功'})
    }).catch(err=>{
        res.json({code:1,message:'修改失败'})
    })
});


//添加榜单信息
router.post('/addrank',function (req,res) {
    let data = Array.from(req.body);
    data.forEach(i=>{
        i.list = i.list.split('-')
    });
    Rank.create(data).then(r=>{
        res.json({
            code:0,
            message:'添加成功'
        })
    }).catch(err=>{
        console.log(err);
        res.json({
            code:1,
            message:'添加失败'
        })
    })

});

//删除榜单信息
router.post('/removerank',function (req,res) {
    Rank.remove({'_id':{$in:req.body.data}})
        .then(r=>{
            console.log(r);
            res.json({
                code:0,
                message:'删除成功'
            })
        })
        .catch(err=>{
            res.json({
                code:1,
                message:'删除失败'
            })
        })
});

//设置广告位图片
//配置广告位图片files参数
let advUpload = upload.fields([
    {name:'index_first',maxCount:1},{name:'index_second',maxCount:1},
    {name:'index_third',maxCount:1},{name:'index_fourth',maxCount:1},
    {name:'index_fifth',maxCount:1}, {name:'news_first',maxCount:1},
    {name:'news_second',maxCount:1}, {name:'detail_first',maxCount:1},
    {name:'detail_second',maxCount:1}, {name:'community_first',maxCount:1},
    {name:'community_second',maxCount:1},

]);
router.post('/setadv',advUpload,function (req,res) {

    Adv.findOne({},function (err,doc) {
        for(let attr in req.files){
            if(doc[attr]){
                //如果是替换图片，则使用绝对路径删除原来的图片
                fs.unlinkSync(path.resolve(__dirname,'..'+doc[attr]),function (err) {console.log(err)})
            }
            doc[attr] = '/public/images/'+req.files[attr][0].filename
        }
        doc.save()
    }).then(()=>{
        res.json({code:0,message:'添加成功'});
    }).catch(err=>{
        console.log(err);
        res.json({code:1,message:'添加失败'});
    })

});

//配置bannerfiles参数
let bannerUpload = upload.fields([
    {name:'first',maxCount:1},
    {name:'second',maxCount:1},
    {name:'third',maxCount:1},
    {name:'fourth',maxCount:1},
    {name:'fifth',maxCount:1},
]);

//编辑bannerlist
router.post('/addbanner',bannerUpload,function (req,res) {
    let srcarr = [req.files.first,req.files.second,req.files.third,req.files.fourth,req.files.fifth];
    let linkarr = [req.body.firstlink,req.body.secondlink,req.body.thirdlink,req.body.fourthlink,req.body.fifthlink];
    BannerList.findOne({},function (err,doc) {
        for (let i = 0;i<=4;i++){
            if(doc.data[i] && srcarr[i]){
                // 替换banner图
                fs.unlinkSync(path.resolve(__dirname,'..'+doc.data[i].src),function (err) {console.log(err)});
                doc.data[i].src = '/public/images/'+srcarr[i][0].filename;
                doc.data[i].link = linkarr[i];
            }else if(!doc.data[i] && srcarr[i]){
                doc.data[i] = {};
                doc.data[i].src = '/public/images/'+srcarr[i][0].filename;
                doc.data[i].link = linkarr[i];
            }
        }

        doc.save();
    }).then((r)=>{
        res.json({
            code:0,
            message:'编辑成功'
        })
    }).catch(err=>{
        console.log(err);
        res.json({
            code:1,
            message:'编辑失败'
        })
    })
});



//获取新闻分类列表
router.get('/newslist',function (req,res) {
    NewsCategoryList.find().then(r=> {
        if (r) {
            res.json(r)
        }
    }).catch(err=>{
        console.log(err)
    })
});

//获取影片分类列表
router.get('/moviecategorylist',function (req,res) {
    MovieCategoryList.find().then(r=> {
        if (r) {
            res.json(r)
        }
    }).catch(err=>{
        console.log(err)
    })
});
//用户添加感兴趣的影片类型
router.post('/useraddtag',function (req,res) {
    User.findById(req.body.user,function (err,doc) {
        let b = doc.tags.find((i)=>{
            return i.toString() == req.body._id
        });
        if(b){
            res.json({code:1,messega:'已存在该分类'})
        }else {
            doc.tags.push(mongoose.Types.ObjectId(req.body._id));
            doc.save();
            res.json({code:0,messega:'添加成功'})
        }
    })
});
//用户删除感兴趣的影片类型
router.post('/userremovetag',function (req,res) {
    User.findById(req.body.user,function (err,doc) {
        let b = doc.tags.findIndex((i)=>{
            return i.toString() == req.body._id
        });
        if(b!=-1){
            doc.tags.splice(b,1);
            doc.save();
            res.json({code:0,messega:'删除成功'})
        }else {
            res.json({code:1,messega:'删除失败'})
        }
    })
});

module.exports = router;