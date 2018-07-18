const tools = {
    //过滤查找的重复数据
    filterData(data){
        let newData = [];
        data.forEach(item=>{
            if(!newData.find(i=>i._id.toString() === item._id.toString())){
                newData.push(item)
            }
        });
        return newData
    },
    //限制综合数据的条数（优先添加影片数据，导演数据存在则添加一条）
    dataLimit(n,data){
        if(!n) return //如果没有条数限制，不处理原数据
        n=Number(n);
        let moviesLength = data.movies.length;
        let directorsLength = data.directors.length;
        if (moviesLength>=n){//影片数据长度大于限制数据条数
            if(directorsLength){//有导演数据
                data.movies.splice(n-1);
                data.directors.splice(1);
            }else {
                //没有导演数据则全部填充影片数据
                data.movies.splice(n);
            }
        }else {
            //影片数据长度小于限制数据条数则用导演数组补充缺口
            let m = n - moviesLength;//缺少的条数
            data.directors.splice(m);//尽量用导演数据补充缺口
        }

    },
    maindataLimit(n,data){
        if(!n) return //如果没有条数限制，不处理原数据
        n=Number(n);
        let moviesLength = data.movies.length;
        let newsLength = data.news.length;
        let ranklength = data.ranks.length;

        if (moviesLength>=n){//影片数据长度大于限制数据条数
            if(newsLength && ranklength){//有新闻和排行信息
                data.movies.splice(n-3);
                data.news.splice(2);
                data.ranks.splice(1);

            }else if(newsLength && !ranklength) {
                data.movies.splice(n-2);
                data.news.splice(2);
            }else if(!newsLength && ranklength) {
                data.movies.splice(n-1);
                data.ranks.splice(1);
            }else {
                data.movies.splice(n);
            }
        }else {
            //影片数据长度小于限制数据条数则用其他数组补充缺口
            let m = n - moviesLength;//缺少的条数
            if(m>1){
                data.news.splice(m-1);
                data.ranks.splice(1);
            }else {
                data.news.splice(1);
                data.ranks.splice(0)
            }
        }

    }
}

module.exports = tools