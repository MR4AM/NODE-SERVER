const wxrequest = require('superagent');
//微信接口列表
const PUBLIC_API=require('../utils/wxapi');
//响应体的统一格式
const apiResult=require('../utils/apiResult');
//微信签名算法
const wxsignature=require('../utils/wxsignature');
module.exports={
    publicToken(app){
        app.get('/publicToken',(req,result)=>{
            console.log(PUBLIC_API,'注入接口调用');
            wxrequest.get(PUBLIC_API.PUBLIC_ACCESSTOKEN).end((req1,res)=>{
                if(res!==undefined){
                    console.log(res.body,'请求微信接口');
                    result.send(apiResult(200,res.body,'返回成功',null));
                    return res.body.access_token;
                }else{
                    result.send(apiResult(500,null,'系统错误，请稍后重试','系统错误，请稍后重试'))
                }
            })
        })
    },
    config(app){
        let configPar={};//返回给前端的配置参数
        app.get('/wxconfig',(req,result)=>{
            wxrequest.get(PUBLIC_API.JSAPI_TICKET).end((req1,res)=>{
                if(res!==undefined){
                    console.log(res.body,'请求微信jsapi_ticket接口');
                    if(res.body.errcode==42001){
                        result.send(apiResult(200,{},'调用凭证失效',null))
                    }
                    configPar=wxsignature.sha1(res.body.ticket);
                    configPar.ticket=res.body.ticket;
                    result.send(apiResult(200,configPar,'返回成功',null));
                    return configPar;
                }else{
                    result.send(apiResult(500,null,'系统错误，请稍后重试','系统错误，请稍后重试'))
                }
            })
        })
    }
}