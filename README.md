# 暮光网项目后端
## 项目名称：《暮光网》
## 项目介绍：《暮光网》是一个电影门户网，属于个人项目，用于前后端技术研究
## 项目开发周期：201804-2018-06
## 项目后端技术栈：node,express,mongodb,mongoose,moment.js,multer,session
## 项目功能：会员登陆注册，会员后台管理，会员积分，网站后台管理，评论点赞，收藏，网站数据录入，多媒体文件上传，多媒体文件在线播放，站内模糊搜索
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
    
    
    
    
    
