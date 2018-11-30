const filter = require('../utils/filter')
const db = require('../db')
const apiResult=require('../utils/apiResult') 

module.exports = {
    register(app){
        //node利用express搭建http服务提供web数据交互连接和交互，req为请求体，res为响应体
        app.get('/test',(req,res)=>{
            console.log(req.query,'用户请求进来了')
            res.send(apiResult(true,'78787','iiiii','jasjsjsj'))
        })
    }
}