//引入node模块
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const bp = require('body-parser');
const session = require('express-session');
const fs =require('fs');


//引入业务进程
const userRouter = require('./users')
const productRouter = require('./product');
const orderRouter = require('./order');
const ioserverRouter = require('./ioserver');
// const pythtest=require('./pythtest');
const pythwords=require('./pythwords');
const dns=require('./dns');
const unload=require('./unload');
const wxconfig=require('./wxconfig');
// const wxpay=require('./wxpay');

//跨域处理
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    if(req.method == 'OPTIONS') {
        //让options预请求快速返回
        res.sendStatus(200); 
    } else { 
        next(); 
    }
});
//统一管理静态资源文件
// app.use(express.static(path.join(path.resolve(__dirname, '../'), 'static')));
// app.use(bp.urlencoded({extended: false}));
// app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
//中间件 express.static 设置静态文件访问，再用path.join拼接访问路径，path.resolve将相对路径拼接成绝对路径
app.use(express.static(path.join(path.resolve(__dirname,'../'))));
app.get('/request',(req,res)=>{
     //response.writeHead(响应状态码，响应头对象): 发送一个响应头给请求。
     res.writeHead(200,{'Content-Type':'text/html'})
     // 如果url=‘/’ ,读取指定文件下的html文件，渲染到页面。
    //  fs.readFile('../fireframes.html','utf-8',function(err,data){
    //      if(err){
    //          throw err;
    //      }else{
    //         return res.send(data);
    //      }
    //  });
    res.render('../fireframes.html',{
        title: '首页',
    });
})
//集中服务进程统一执行
module.exports = {
    start(_port){
        orderRouter.register(app);
        ioserverRouter.startio(io);
        http.listen(_port || 8080);
        // unload.singleunload(app);
        //注入微信sdk签名及调用配置
        wxconfig.config(app);
        wxconfig.testApi(app);
        wxconfig.publicToken(app);
        wxconfig.wxjump(app);
        // wxpay.wxpay(app);
    }
}