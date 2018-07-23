# 暮光网项目后端
## 项目名称：《暮光网》
## 项目介绍：《暮光网》是一个电影门户网，属于个人项目，用于前后端技术研究
## 项目开发周期：201804-2018-06
## 项目后端技术栈：node,express,mongodb,mongoose,moment.js,multer,session
## 项目功能：
    会员登陆注册，
    会员后台管理，
    会员积分，
    网站后台管理，
    评论点赞，
    收藏，
    网站数据录入，
    多媒体文件上传，
    多媒体文件在线播放，
    站内模糊搜索
## 项目数据库表：

    advertisements:广告数据表，
    bannerlists:轮播图数据表，
    comments:评论数据表,
    directors:导演数据表,
    mainmenulists:主导航数据表,
    moviecategorylists:电影分类数据表,
    movies:电影数据表,
    news:新闻数据表,
    newscategorylists:新闻栏目数据表,
    ranks:排行榜数据表,
    searchlists:搜索分类数据表,
    users:用户数据表
## 项目接口分发：
### admin:网站后台管理接口
    /userpic：会员上传头像
    /usernickname：会员修改昵称
    /useraddtag：会员添加感兴趣的影片分类
    /userremovetag：会员删除感兴趣的影片分类
    /addmovie：添加影片数据
    /addnews：添加新闻数据
    /changemainmenu：编辑主导航数据
    /addrank：编辑排行榜榜单数据
    /removerank：删除排行榜数据
    /setadv：上传广告位图片
    /addbanner：编辑主banner图数据
    /newslist：获取新闻分类列表数据
    /moviecategorylist：获取影片分类数据
### user:用户登陆注册登出接口
    /login：用户登陆
    /loginout：用户安全退出
    /register/username：用户注册用户名是否重复先行验证（注册时，用户名边输入边验证）
    /register：用户注册
### api:网站数据获取接口
    /userallinfo：获取用户全部信息
    /mainmenulist：获取主导航信息
    /searchlist：获取搜索分类信息
    /searchdata：管理员后台模糊搜索影片或导演数据信息
    /mainsearch：网站影片、排行榜、新闻数据模糊搜索
    /ranklist：获取排行榜列表信息
    /rankdetail：根据_id获取排行榜信息
    /bannerlist：获取主轮播图信息
    /usersrank：根据会员积分排名从大到小获取会员列表信息
    /moviecommentrank：根据评论数获取影片信息
    /sellingmovies：获取正在售票的影片列表信息
    /showsoon：获取即将上映的影片列表信息
    /singlemovie：根据_id获取影片信息
    /sellingmovieshot：根据点赞数从大到小获取正在售票影片列表信息
    /oldmovie：根据评分从大到小获取上映时间在2000年以前的影片列表信息
    /samemovietag：获取同类影片列表信息
    /hotshowsoon：根据影片期待人数从大到小获取即将上映的影片列表信息
    /allshowsoon：获取即将上映的影片根据上映的月份打包成若干数组，每个数组的若干个影片都是同年同月上映
    /hotmoviepage：根据点赞数从大到小，分页获取正在上映的影片信息
    /allmovierank：根据点赞数从大到小获取影片列表数据
    /getnews：根据栏目分类获取新闻列表数据
    /singlenews：根据_id获取指定新闻数据
    /addnewsreadcount：指定新闻阅读量+1
    /gethotnews：获取热读新闻，在指定的时间段内按阅读量排名
    /getnewsbymovieid：根据影片_id获取改影片的所有新闻数据
    /getnewsbycommentcount：根据新闻评论数获取热评新闻
    /comment：会员提交评论
    /showmoviecomment：根据点赞数排名从大到小获取影片的长影评数据
    /getlongcomments：获取指定_id的影片的长影评
    /getshortcomments：获取指定_id的影片的短影评
    /isagreecomment：给新闻或影片的评论点赞
    /isagreenews：给新闻点赞
    /movieup：给影片点赞
    /moviewantsee：会员期待某影片，添加收藏
    /advertisementsrc：获取广告位数据
    /hotdirector：获取所有导演的数据
    
### rank:获取根据指定规则排列的数据
    /movieshotlist：根据影片的期待人数获取正在上映的影片（热映影片数据）
    /totalprice：根据票房从大到小获取影片数据
    /totalprice-show：根据票房从大到小获取影片数据，影片范围：正在上映的影片
    /totalprice-year：根据票房从大到小获取影片数据，影片范围：今年上映的影片
    
## 后端开发中遇到的困难
### 前后端开发环境中的跨域配置与跨域提交cookie的配置
    解决方法：使用cors跨域，在跨域提交cookie的情况中，cors配置"Access-Control-Allow-Origin"不能为 "\*",必须为一个指定的域名，其次，为了使AXIOS跨域请求带上COOKIE需要进行如下设置：axios.defaults.withCredentials=true

### 后端上传多媒体文件如何命名，如果避免重复命名
    解决方法：引入crypto，使用md5+hex对文件进行命名
    crypto.createHmac('md5',Math.random().toString() ).update(Date.now().toString()).digest('hex')

### Mongoose中关联查询populate的具体使用方法
    解决方法：查询了很多文档，没有得到我所使用的场景的解决方案，我所需要解决的是：
    1.当查询到了关联的数据表的数据后，如果对该数据表返回的数据进行相关处理，如排序，限制条数等
    解决：首先，在使用populate的那个模块一定要引入关联数据表，populate()中的参数可以定义多个关联字段，其他参数可以对该字段对应的数据表进行附加条件查询，字段筛选，排序条数限制等操作
    2.如果查询关联的数据表中关联的数据表的数据
    解决：链式调用populate()
    
### Mongoose模糊查找
    解决方法：高级匹配符$regex与$or等的配合使用，需要注意一切搜索场合中合并数据的重复数据现象，需要进行筛选
    
### 日期格式的处理以及日期时间段内数据的检索，日期的对比等问题
    解决方法：使用moment日期处理类库，可以将ISO日期转成你想要的UTC日期格式，可以对两个日期进行先后顺序的比较，配合高级匹配符$gt,$lt,$and等可以筛选指定日期范围内的数据，使用moment().subtract()可以设置一个从此刻起，多少天以前的一个具体时间点，moment().add()获取一个此刻起多少天以后的一个时间点，灵活使用这些丰富的接口可以在很多场景需求游刃有余
    
## 总结
    1.接口可以封装的更灵活，适应更多类似数据请求的场景
    2.数据结构设计上反反复复修改了很多次，也算是一种经历吧，前期的数据结构的设计关系着后期的数据获取及渲染的可行性和便利性
    3.对于生僻技术的探索很成功，完全解决了项目需求的技术难点
    4.与前端配合验证登陆注册这一块的场景考虑的很周全，如重复登陆同一账号，登陆状态下继续登陆另一账号以及未登录状态下前往不同的路由后端是否需要做登陆验证以拦截路由等场景
    5.对于数据库和数据结构设计的研究需要深入下去





    
    
    
