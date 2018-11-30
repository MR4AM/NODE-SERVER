//  author limenghui created in 2018.8.17
//目标：nodejs实现基本的数据爬取并将数据进行存储，以爬取网页图片为例
//思路：nodejs的语法结构类似js,对于前端还是非常有好的，提供了较多的模块可以连接服务层和解决js所无法实现的读写权限。该方法较简略，整合了网上nodejs初步爬虫的大体思路方法。
//1.首先，确定爬取网站的的网页地址url http://www.ivsky.com/tupian/
//2.利用http模块向该网站发起服务请求，获取响应信息。
//3.利用cheerio选择器模块解析请求回来的页面DOM结构，并利用正则将所需的页面信息截取成对应的数据结构，将数据结构返回到数据库中进行存储。
//4.利用fs模块解析数据结构并存储到本地。

const request = require('superagent');//http模块，用于请求数据
const cheerio = require('cheerio');//解析DOM
const fs = require('fs');//nodejs文件模块
const async=require('async');//异步模块


module.exports={
    pythword(){
        let targetUrl='http://www.ivsky.com/tupian/';
        let imgArr=[];
        request.get(targetUrl).end((err,res)=>{
            if(err){
                console.log(err); 
                return;
            }
            let $ =cheerio.load(res.text);
            let content;
            $('.ali li').each((index,item)=>{
                console.log($(item).find('.il_img img').attr('src'),'查看网页解构');
                imgArr.push($(item).find('.il_img img').attr('src'))
                console.log('获取爬取图片的数组',imgArr);
            })
            async.mapSeries(imgArr,function(imgUrl, callback){
                console.log(imgUrl,'检测')
                setTimeout(function(){
                    let imgName = imgUrl.split('/').pop();
                    downloadPic(imgUrl.indexOf('https:')?imgUrl:'https:'+ imgUrl, './catpics/');
                  callback(null, imgUrl);
                },400);
              }, function(err, results){});
            //存放数据
            // mkdir('./images',downloadImg);
        })
        //创建存储爬虫图片的目录
         function mkdir(_path,callback){
            if(fs.existsSync(_path)){
            console.log(`${_path}目录已存在`)
            }else{
            fs.mkdir(_path,(error)=>{
                if(error){
                return console.log(`创建${_path}目录失败`);
                }
                console.log(`创建${_path}目录成功`)
            })
            }
            callback(); //没有生成指定目录不会执行
        }
         //下载爬取的图片
         function downloadImg() {
            imgArr.forEach((imgUrl,index) => {
                //获取图片名 
                let imgName = imgUrl.split('/').pop();
            
                //下载图片存放到指定目录（单线程同步队列下载图片，速度较慢）
                let stream = fs.createWriteStream(`./images/${imgName}`);
                let req = request.get(imgUrl.indexOf('https:')?imgUrl:'https:'+ imgUrl); //响应流
                req.pipe(stream);
                console.log(`开始下载图片 https:${imgUrl} --> ./images/${imgName}`);     
            } )
        }
       function downloadPic(src, dest){
           
            request.get(src).pipe(fs.createWriteStream(fs.mkdir(dest))).on('close',function(){
              console.log('pic saved!')
            })
          }

    }
}