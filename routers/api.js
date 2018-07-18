const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const tools = require('../public/js/tools');
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
const Comment = require('../model/comment');
const User = require('../model/user');


//获取用户全部信息
router.post('/userallinfo',function (req,res) {
    User.findById(req.body.id).populate('like tags wish').then(r=>{
        res.json({data:r})
    }).catch(err=>{
        console.log(err)
    })
});

//获取主导航信息接口
router.get('/mainmenulist',function (req,res) {
    MainMenuList.findOne().then(r=>{
        if(r){
            res.json(r)
        }
    }).catch(err=>{console.log(err)})
})
//获取搜索分类列表
router.get('/searchlist',function (req,res) {
    SearchList.find().then(r=>{
        if(r){
            res.json(r)
        }else {

        }
    })
})
//获取搜索信息
router.post('/searchdata',function (req,res) {

    //配置返回数据格式、返回数据字段控制、匹配正则
    let resarr={
        movies:[],
        directors:[]
    };
    if(!req.body.key || !req.body.key.trim()){
        res.json({data:resarr});
        return
    }
    let needInfo = {_id:1,name:1,englishname:1,showtime:1,director:1,alias:1,vertical:1};
    let reg = new RegExp(req.body.key,'i');
    let limit = req.body.limit;//返回条数
    //查找范围是导演数据和影片数据
    if(req.body.range==='all'){

        //通过影片中文名和英文名搜索数据
        let p1=Movie.find({$or:[{name:{$regex:reg}}, {englishname:{$regex:reg}}]},needInfo)
                .populate({
                    path:'director',
                    select:'-__v'
                }).then(r=>{
                    resarr.movies.push(...r)
            });

        //通过影片别名搜索数据
        let p2=Movie.find(null,needInfo)
                    .populate({
                        path:'director',
                        select:'-__v'
                    })
                    .then(r=>{
                        r.forEach(item=>{
                            if(item.alias.find(i=>reg.test(i))){
                                resarr.movies.push(item)
                            }
                        })
                    })

        //通过导演名搜索数据
        let p3=Director.find({$or:[{name:{$regex:reg}},{transliteration:{$regex:reg}}]})
            .then(r=>{
                //导演数据搜索不会出现重复现象
                resarr.directors.push(...r)
            })

        //数据搜索完毕发送给前端
        Promise.all([p1,p2,p3]).then(()=>{
            //将搜索的影片数据去重
            resarr.movies = tools.filterData(resarr.movies);

            //截取超过限定条数的数据
            tools.dataLimit(limit,resarr)
            res.json({data:resarr})
        })

    //查找范围是导演数据
    }else if(req.body.range==='director'){
        Director.find({$or:[{name:{$regex:reg}},{transliteration:{$regex:reg}}]})
            .then(r=>{
                resarr.directors.push(...r);
                //导演数据搜索不会出现重复现象，只需要限制条数
                resarr.directors.splice(limit);
                res.json({data:resarr})
            })

    //查找范围是影片数据
    }else if(req.body.range==='movie'){

        let p1=Movie.find({$or:[{name:{$regex:reg}}, {englishname:{$regex:reg}}]},needInfo)
            .populate({
                path:'director',
                select:'-__v'
            }).then(r=>{
                resarr.movies.push(...r)
            });

        let p2=Movie.find(null,needInfo)
            .populate({
                path:'director',
                select:'-__v'
            })
            .then(r=>{
                r.forEach(item=>{
                    if(item.alias.find(i=>reg.test(i))){
                        resarr.movies.push(item)
                    }
                })
            });

        Promise.all([p1,p2]).then(()=>{
            //将搜索的影片数据去重
            resarr.movies = tools.filterData(resarr.movies);
            //截取超过限定条数的数据
            resarr.movies.splice(limit);
            res.json({data:resarr})
        })
    }else {
        res.json({data:resarr})
    }
});

//首页搜索框搜索
router.post('/mainsearch',function (req,res) {

    let resarr = {
        movies:[],
        ranks:[],
        news:[]
    };
    if(!req.body.key.trim()){
        res.json({data:resarr});
        return
    }
    let reg = new RegExp(req.body.key,'i')
    let limit =Number(req.body.limit)//返回条数

    //查找范围是全部
    if(req.body.range==='all'){

        //通过影片中文名和英文名搜索数据
        let p1=Movie.find({$or:[{name:{$regex:reg}}, {englishname:{$regex:reg}}]})
            .populate('director tag').then(r=>{
                resarr.movies.push(...r);
                resarr.movies = [...resarr.movies]
            });

        //通过影片别名搜索数据
        let p2=Movie.find()
            .populate('director tag')
            .then(r=>{
                r.forEach(item=>{
                    if(item.alias.find(i=>reg.test(i))){
                        resarr.movies.push(item)
                    }
                });
                resarr.movies = [...resarr.movies]
            });

        //通过新闻名搜索数据
        let p3=News.find({$or:[{title:{$regex:reg}},{subtitle:{$regex:reg}}]})
            .then(r=>{
                //新闻数据搜索不会出现重复现象
                resarr.news.push(...r)
            });

        //通过排行榜名搜索数据
        let p4=Rank.find({title:{$regex:reg}}).populate('list')
            .then(r=>{
                resarr.ranks.push(...r)
            });

        //数据搜索完毕发送给前端
        Promise.all([p1,p2,p3,p4]).then(()=>{
            //将搜索的影片数据去重
            resarr.movies = tools.filterData(resarr.movies);

            //截取超过限定条数的数据
            if(limit){
                tools.maindataLimit(limit,resarr)
            }
            res.json({data:resarr})
        })

    }else if(req.body.range==='movie'){

        let p1=Movie.find({$or:[{name:{$regex:reg}}, {englishname:{$regex:reg}}]})
            .populate('director tag').then(r=>{
                resarr.movies.push(...r)
                resarr.movies = [...resarr.movies]
            });

        let p2=Movie.find()
            .populate('director tag').then(r=>{
                r.forEach(item=>{
                    if(item.alias.find(i=>reg.test(i))){
                        resarr.movies.push(item)
                    }
                })
                resarr.movies = [...resarr.movies]
            });

        Promise.all([p1,p2]).then(()=>{
            //将搜索的影片数据去重
            resarr.movies = tools.filterData(resarr.movies);
            //截取超过限定条数的数据
            if(limit) resarr.movies.splice(limit);
            res.json({data:resarr})
        })
    }else if(req.body.range==='news'){
        News.find({$or:[{title:{$regex:reg}},{subtitle:{$regex:reg}}]})
            .then(r=>{
                //新闻数据搜索不会出现重复现象
                resarr.news.push(...r);
                if(limit) resarr.news.splice(limit);
                res.json({data:resarr})
            });
    }else if(req.body.range==='rank'){
        Rank.find({title:{$regex:reg}}).populate('list').then(r=>{
            resarr.ranks.push(...r);
            if(limit) resarr.ranks.splice(limit);
            res.json({data:resarr})
        });
    }else {
        res.json({data:resarr})
    }

});

//获取排行榜列表
router.post('/ranklist',function (req,res) {
    let page = Number(req.body.page) || 1;//当前页码
    let eachcount = Number(req.body.count) || 5;//每页显示条数，默认5条
    let totalpages = null;//总页数
    let skipcount = eachcount*(page-1);//忽略前面的条数
    let needinfo = {name:1,_id:1,vertical:1,horizontal:1,score:1,showtime:1,};
    Rank.count().then(n=>{
        totalpages = Math.ceil(n/eachcount);
    })
        .then(()=>{
            Rank.find().populate('list',needinfo).skip(skipcount).limit(eachcount).sort({_id:-1})
                .then(r=>{
                    res.json({
                        data:r,
                        totalpages
                    })
                })
                .catch((err)=>{
                    console.log(err)
                })
        })
});
//根据_id获取排行榜信息
router.post('/rankdetail',function (req,res) {
    Rank.findById(req.body.id).populate({
        path:'list',
        select:null,
        populate:{
            path:'director'
        }
    })
        .then(r=>{
            res.json({data:r})
        })
        .catch((err)=>{
            console.log(err)
        })
});

//获取banner图数据
router.get('/bannerlist',function (req,res) {
    BannerList.findOne().then(r=>{
        res.json(r)
    })
});
//获取用户信息，根据积分排名
router.get('/usersrank',function (req,res) {
    let needinfo = {nickname:1,exp:1,img:1};
    User.find({},needinfo).limit(5).sort({exp:-1}).populate('tags',null,null,null,{sort:{_id:-1}}).then(r=>{
        res.json({data:r})
    })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'获取数据失败'})
        })
});

/**
 * 获取影片信息
 */

//根据评论数排名电影
router.get('/moviecommentrank',function (req,res) {
    Movie.find({},{vertical:1,name:1,commentnum:1}).sort({commentnum:-1}).limit(5)
        .then(r=>{
            res.json({data:r})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'获取数据失败'})
        })
});
//获取正在售票影片数据
router.get('/sellingmovies',function (req,res) {
    let today = moment().toISOString();
    let tmonthago = moment().subtract(60,'d').toISOString();//从此刻算起，一个月以前的时间点（由于客观因素，获取两个月以前的时间点）
    let needinfo = {alias:0,ups:0,src:0,newsnum:0,wantsee:0,englishname:0,director:0,totalprice:0,banner:0};
    Movie.find({'$and':[{showtime:{'$gt':tmonthago}},{showtime:{'$lte':today}}]},needinfo)
        .populate('tag').sort({showtime:-1})
        .then(r=>{
            res.json({data:r,code:0})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })

});
//获取即将上映的影片数据
router.get('/showsoon',function (req,res) {
    let today = moment().toISOString();
    let afterhalfyear = moment().add(6,'M').toISOString();//6个月后的时间点
    let needinfo = {alias:0,ups:0,src:0,newsnum:0,englishname:0,totalprice:0};

    Movie.find({'$and':[{showtime:{'$gt':today}},{showtime:{'$lte':afterhalfyear}}]},needinfo)
        .populate('tag director').sort({showtime:1})
        .then(r=>{
            res.json({data:r,code:0});
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })
});
//通过_id获取指定影片数据
router.post('/singlemovie',function (req,res) {
    Movie.findById(req.body._id).populate('tag director').then(r=>{
        res.json({data:r})
    }).catch(err=>{
        console.log(err);
        res.json({code:1,message:'数据获取失败'})
    })
});
//获取正在上映的影片，按点赞数排名
router.get('/sellingmovieshot',function (req,res) {
    let today = moment().toISOString();
    let tmonthago = moment().subtract(60,'d').toISOString();//从此刻算起，一个月以前的时间点（由于客观因素，获取两个月以前的时间点）
    let needinfo = {alias:0,ups:0,src:0,newsnum:0,wantsee:0,englishname:0,director:0,totalprice:0,banner:0};
    Movie.find({'$and':[{showtime:{'$gt':tmonthago}},{showtime:{'$lte':today}}]},needinfo).sort({ups:-1})
        .then(r=>{
            res.json({data:r,code:0})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })

});
//获取2000年以前的影片，按评分排名
router.post('/oldmovie',function (req,res) {
    let limit = Number(req.body.limit) || 1000;
    let time =moment(moment().year(2000)).endOf('year');
    Movie.find({showtime:{'$lte':time}}).limit(limit).sort({score:-1})
        .then(r=>{
            res.json({data:r,code:0})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })
});
//获取同类影片
router.post('/samemovietag',function (req,res) {
    let limit = Number(req.body.limit) || 10000;
    Movie.find({tag:req.body.tag,_id:{$ne:req.body.currentid}},{name:1,_id:1,vertical:1}).limit(limit).sort({ups:-1}).then(r=>{
        res.json({data:r})
    }).catch(err=>{
        console.log(err);
        res.json({code:1,message:'获取数据失败'})
    })
});
//获取即将上映的影评，根据想看数排名
router.post('/hotshowsoon',function (req,res) {
    let limit = Number(req.body.limit) || 1000;
    let today = moment().toISOString();
    let afterhalfyear = moment().add(6,'M').toISOString();//6个月后的时间点
    let needinfo = {alias:0,ups:0,src:0,newsnum:0,englishname:0,totalprice:0};

    Movie.find({'$and':[{showtime:{'$gt':today}},{showtime:{'$lte':afterhalfyear}}]},needinfo)
        .populate('tag director').sort({wantsee:-1}).limit(limit)
        .then(r=>{
            res.json({data:r,code:0});
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })
});

//获取即将上映的影片，按时间打包成多个数组
router.get('/allshowsoon',function (req,res) {
    let today = moment().toISOString();
    let afterhalfyear = moment().add(6,'M').toISOString();//6个月后的时间点
    Movie.find({'$and':[{showtime:{'$gt':today}},{showtime:{'$lte':afterhalfyear}}]})
        .populate('tag director').sort({showtime:1})
        .then(r=>{
            let data = [];
            for(let i=0;i<r.length;i++){
                if(!data.length){
                    data.push([r[i]])
                }else {
                    let onoff = true;
                    for (let j=0;j<data.length;j++){
                        if(moment(data[j][0].showtime).isSame(moment(r[i].showtime))){
                            onoff = false;
                            data[j].push(r[i]);
                            break
                        }
                    }
                    onoff && data.push([r[i]])
                }
            }
            res.json({data,code:0});
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })
});

//获取正在上映的影片，根据点赞数排名，分页获取
router.post('/hotmoviepage',function (req,res) {
    let page = Number(req.body.page) || 1;
    let eachcount = Number(req.body.eachcount) || 5;
    let totalpages = null;//总页数
    let skipcount = eachcount*(page-1);//忽略前面的条数
    let today = moment().toISOString();
    let tmonthago = moment().subtract(60,'d').toISOString();
    Movie.count({'$and':[{showtime:{'$gt':tmonthago}},{showtime:{'$lte':today}}]}).then(n=>{
        totalpages  = Math.ceil(n/eachcount);
        Movie.find({'$and':[{showtime:{'$gt':tmonthago}},{showtime:{'$lte':today}}]})
            .populate('tag director').sort({ups:-1}).skip(skipcount).limit(eachcount)
            .then(r=>{
                res.json({data:r,code:0,totalpages})
            })
            .catch(err=>{
                console.log(err);
                res.json({code:1,message:'数据获取失败'})
            })
    })
});

//根据点赞数排名的影片，范围：所有的影片
router.post('/allmovierank',function (req,res) {
    let limit = Number(req.body.limit) || 6;//每页显示条数
    let currentpage = Number(req.body.page) || 1;
    Movie.count().then(n=>{
        let totalpages = Math.ceil(n/limit);
        let skip = (currentpage - 1)*limit;
        Movie.find().sort({score:-1}).skip(skip).limit(limit).populate('tag director').then(r=>{
            res.json({data:r,totalpages})
        }).catch(err=>{
            console.log(err)
        })
    })
})

/**
 * 获取新闻信息
 */

//根据栏目分类获取新闻数据
router.post('/getnews',function (req,res) {
    let needinfo = {_id:1,editdate:1,tag:1,category:1,model:1,title:1,subtitle:1,img:1};
    if(req.body.category){
        let id = mongoose.Types.ObjectId(req.body.category);
        News.find({category:id},needinfo)
            .sort({editdate:-1}).skip(Number(req.body.skip)).limit(Number(req.body.limit))
            .then(r=>{
                ////////////////////////////////////生产环境模拟数据延迟
                setTimeout(function () {
                    res.json({data:r,code:0})
                },1000)
            })
            .catch(err=>{
                console.log(err);
                setTimeout(function () {
                    res.json({code:1,message:'加载失败，刷新试试哦~'})
                },1000)
            })
    }else {
        News.find({},needinfo)
            .sort({editdate:-1}).skip(Number(req.body.skip)).limit(Number(req.body.limit))
            .then(r=>{
                setTimeout(function () {
                    res.json({data:r,code:0})
                },1000)
            })
            .catch(err=>{
                console.log(err);
                setTimeout(function () {
                    res.json({code:1,message:'加载失败，刷新试试哦~'})
                },1000)
            })
    }

});
//通过_id获取指定新闻
router.post('/singlenews',function (req,res) {
    News.findById(req.body._id).populate('movie',{tag:1}).then(r=>{
        res.json({data:r})
    }).catch(err=>{
        console.log(err);
        res.json({code:1,message:'数据获取失败'})
    })
});
//新闻阅读量+1
router.post('/addnewsreadcount',function (req,res) {
    News.findById(req.body.id,function (err,doc) {
        doc.readingcount+=1;
        doc.save();
    }).then(()=>{
        res.json({})
    }).catch(err=>{
        console.log(err);
        res.json({})
    })
});
//获取热读新闻，在规定的时间段内按阅读量排名
router.post('/gethotnews',function (req,res) {
    let todayiso = moment().toISOString();//现在的时间点
    let beforedate = moment().subtract(Number(req.body.days),'d').toISOString();//若干天以前的时间点
    News.find({$and:[{editdate:{$gte:beforedate}},{editdate:{$lte:todayiso}}]})
        .limit(Number(req.body.limit)).sort({readingcount:-1})
        .then(r=>{
            res.json({data:r})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'获取数据失败'})
        })
});
//通过影片id找相关新闻
router.post('/getnewsbymovieid',function (req,res) {
    let limit = Number(req.body.limit) || 1000;
    let id = mongoose.Types.ObjectId(req.body.id);
    News.find({movie:id}).sort({editdate:-1}).limit(limit)
        .then((r)=>{
            res.json({data:r})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })
});
//通过新闻评论数量排名
router.get('/getnewsbycommentcount',function (req,res) {
    News.find().sort({commontcount:-1}).limit(3)
        .then((r)=>{
            res.json({data:r})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })
});

/**
 * 提交点赞评论
 */

//提交评论
router.post('/comment',function (req,res) {
    let islongcomment = false;
    if(req.body.comment.trim().length > 80){
        islongcomment = true
    }
    Comment.create({
        user:req.body.user,
        commenttype:req.body.commenttype,
        comment:req.body.comment,
        ascription:req.body.ascription,
        islongcomment:req.body.commenttype === 'news'? false : islongcomment
    }).then(r=>{
        res.json({code:0,message:'评论成功'})
    }).then(()=>{
        if(req.body.commenttype === 'movie'){
            Movie.findById(req.body.ascription,function (err,doc) {
                doc.commentnum+=1;
                doc.save()
            })
        }else{
            News.findById(req.body.ascription,function (err,doc) {
                doc.commontcount+=1;
                doc.save()
            })
        }
        //评论后给用户账号添加经验值10
        User.findById(req.body.user,function (err,doc) {
            doc.exp+=10;
            doc.save();
        })
    })
        .catch(err=>{
        console.log(err);
        res.json({
            code:1,
            message:'评论失败'
        })
    })
});
//获取上映影片的长影评，并按照点赞数排名
router.post('/showmoviecomment',function (req,res) {
    let movieneedinfo = {vertical:1,ups:1,name:1,banner:1,showtime:1,score:1};//影片有效信息
    let userneedinfo = {img:1,nickname:1};//用户有效信息
    let page = Number(req.body.page) || 1;//页码
    let count = Number(req.body.count) || 6;//每页条数
    let today = moment().toISOString();//今天的日期
    let twomonthago = moment().subtract(60,'d').toISOString();

    Comment.find({islongcomment:true,commenttype:'movie'})
        .populate([{
            path:'ascription',
            select:movieneedinfo
        },
        {
            path:'user',
            select:userneedinfo
        }]).sort({ups:-1})
        .then(r=>{
            let data = [];
            r.forEach((item)=>{
                //如果该条评论所属的电影上映日期处于2个月以前到今天之间的时间段，那么就是有效数据
                if(moment(item.ascription.showtime).isBefore(today) &&
                    moment(item.ascription.showtime).isAfter(twomonthago)
                ){
                    data.push(item);
                }
            });
            let totalpages = Math.ceil(data.length/count);
            let filterdata = data.splice((page-1)*count,count);
            res.json({data:filterdata,totalpages})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'获取数据失败'})
        })

});
//获取长影评
router.post('/getlongcomments',function (req,res) {
    let id = mongoose.Types.ObjectId(req.body.id)
    Comment.find({islongcomment:true,ascription:id})
        .sort({ups:-1}).populate('user',{img:1,nickname:1})
        .then(r=>{
            res.json({data:r})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'获取数据失败'})
        })
});
//获取短影评
router.post('/getshortcomments',function (req,res) {
    let id = mongoose.Types.ObjectId(req.body.id);
    let commenttype =
    Comment.find({islongcomment:false,ascription:id})
        .sort({ups:-1}).populate('user',{img:1,nickname:1})
        .then(r=>{
            res.json({data:r})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'获取数据失败'})
        })
});
//赞和踩评论
router.post('/isagreecomment',function (req,res) {
    Comment.findById(req.body.id,function (err,doc) {
        if(req.body.type === 'agree'){
            doc.ups+=1;
            doc.save()
        }else {
            doc.disagree+=1;
            doc.save()
        }
    }).then(()=>{
        //赞和踩后给用户账号添加经验值1
        User.findById(req.body.user,function (err,doc) {
            doc.exp+=1;
            doc.save();
        })
    }).then(()=>{
        if(req.body.type === 'agree'){
            res.json({code:0,message:'点赞成功'})

        }else {
            res.json({code:0,message:'踩了一脚'})
        }
    }).catch(err=>{
        console.log(err);
        res.json({code:1,message:'操作失败'})
    })
});
//新闻点赞或点踩
router.post('/isagreenews',function (req,res) {
    News.findById(req.body.id,function (err,doc) {
        if(req.body.type === 'agree'){
            doc.up+=1;
            doc.save()
        }else {
            doc.disagree+=1;
            doc.save()
        }
    }).then(()=>{
        //赞和踩后给用户账号添加经验值1
        User.findById(req.body.user,function (err,doc) {
            doc.exp+=1;
            doc.save();
        })
    }).then(()=>{
        if(req.body.type === 'agree'){
            res.json({code:0,message:'点赞成功'})

        }else {
            res.json({code:0,message:'踩了一脚'})
        }
    }).catch(err=>{
        console.log(err);
        res.json({code:1,message:'操作失败'})
    })
})
//影片点赞
router.post('/movieup',function (req,res) {
    Movie.findById(req.body.id,function (err,doc) {
        doc.ups+=1;
        doc.save()
    }).then(()=>{
        User.findById(req.body.user,function (err,doc) {
            doc.like.push(req.body.id);
            doc.save()
        })
    }).then(()=>{
        res.json({code:0,message:'点赞成功'})
    }).catch(err=>{
        console.log(err);
        res.json({code:1,message:'点赞失败'})
    })
});
//影片想看
router.post('/moviewantsee',function (req,res) {
    Movie.findById(req.body.id,function (err,doc) {
        doc.wantsee+=1;
        doc.save()
    }).then(()=>{
        User.findById(req.body.user,function (err,doc) {
            if(doc.wish.findIndex((item)=>item==req.body.id) == -1){
                doc.wish.push(req.body.id);
                doc.save()
            }
        })
    }).then(()=>{
        res.json({code:0,message:'想看成功'})
    }).catch(err=>{
        console.log(err);
        res.json({code:1,message:'想看失败'})
    })
});



//获取广告位图片地址
router.get('/advertisementsrc',function (req,res) {
    Advertisement.findOne().then(r=>{
        res.json({data:r})
    }).catch(err=>{
        console.log(err)
    })
});
//热门导演
router.get('/hotdirector',function (req,res) {
    Director.find().limit(10)
        .then(r=>{
            res.json({data:r,code:0})
        })
        .catch(err=>{
            console.log(err);
            res.json({code:1,message:'数据获取失败'})
        })
});



module.exports = router;