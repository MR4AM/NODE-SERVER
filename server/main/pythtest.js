const request = require('superagent');//http模块，用于请求数据
const cheerio = require('cheerio');//解析DOM
const fs = require('fs');//



module.exports={
    pythtest(){
        let targetUrl = 'https://www.cnblogs.com/';
        //用来暂时保存解析到的内容和图片地址数据
        let content = '';
        let imgs = [];
        //发起请求
        request.get(targetUrl)
        .end( (error,res) => {
        if(error){ //请求出错，打印错误，返回
            console.log(error)
            return;
        }
        // cheerio需要先load html
        let $ = cheerio.load(res.text);
        //抓取需要的数据,each为cheerio提供的方法用来遍历
        $('#post_list .post_item').each( (index,element) => {
            //分析所需要的数据的DOM结构
            //通过选择器定位到目标元素，再获取到数据
            let temp = {
            '标题' : $(element).find('h3 a').text(),
            '作者' : $(element).find('.post_item_foot > a').text(),
            '阅读数' : +$(element).find('.article_view a').text().slice(3,-2),
            '推荐数' : +$(element).find('.diggnum').text()
            }
            //拼接数据
            content += JSON.stringify(temp) + '\n';//\n换行符
            //同样的方式获取图片地址
            if($(element).find('img.pfs').length > 0){
            imgs.push($(element).find('img.pfs').attr('src'));
            }
        });
        //存放数据
        //mkdir('./staics')
        mkdir('./content',saveContent);
        mkdir('./imgs',downloadImg);
        })
        //创建目录
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
        //将文字内容存入txt文件中
        function saveContent() {
            fs.writeFile('./content/content.txt',content.toString());
        }
        //下载爬到的图片
        function downloadImg() {
        imgs.forEach((imgUrl,index) => {
            //获取图片名 
            let imgName = imgUrl.split('/').pop();
        
            //下载图片存放到指定目录
            let stream = fs.createWriteStream(`./imgs/${imgName}`);
            let req = request.get('https:' + imgUrl); //响应流
            req.pipe(stream);
            console.log(`开始下载图片 https:${imgUrl} --> ./imgs/${imgName}`);     
        } )
        }
    }
}