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
    
    
    
    
    
