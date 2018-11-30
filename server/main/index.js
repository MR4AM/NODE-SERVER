//引入node模块
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const bp = require('body-parser');
const session = require('express-session');


//引入业务进程
const userRouter = require('./users')
const productRouter = require('./product');
const orderRouter = require('./order');
const ioserverRouter = require('./ioserver');
// const pythtest=require('./pythtest');
const pythwords=require('./pythwords');
// const dns=require('./dns');

//统一管理静态资源文件
app.use(express.static(path.join(path.resolve(__dirname, '../../'), '/websrc')));
app.use(bp.urlencoded({extended: false}));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

//集中服务进程统一执行
module.exports = {
    start(_port){
        ioserverRouter.startio(io);
        http.listen(_port || 8080);
    }
}