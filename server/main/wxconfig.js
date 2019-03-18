const wxrequest = require('superagent');
//微信接口列表
const PUBLIC_API=require('../utils/wxapi');
//响应体的统一格式
const apiResult=require('../utils/apiResult');
//微信签名算法
const wxsignature=require('../utils/wxsignature');
module.exports={
    testApi(app){
        app.get('/testApi',(req,res)=>{
            console.log('有测试的访问请求进入服务器');
            res.send(apiResult(200,{},'欢迎测试jaServer调用服务器',null));
        })
    },
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
    },
    wxjump(app){
        app.get('/wxjump',(req,res)=>{
            console.log('检测用户请求是否进入微信内置浏览器的下载header设置989888888888888')
            res.header("Content-Type: application/vnd.ms-word;charset=utf-8");
            res.header("Content-Disposition: attachment; filename=\"https://img.shuixindk.cn/wxdownload.doc\"");
            app.all('*', function(req1, res1, next) {
                console.log('检测用户请求是否进入微信内置浏览器的下载header设置')
                res1.header("Content-Type: application/vnd.ms-word;charset=utf-8");
                res1.header("Content-Disposition: attachment; filename=\"load.doc\"");
                if(req1.method == 'OPTIONS') {
                    //让options预请求快速返回
                    res1.sendStatus(200); 
                } else { 
                    next(); 
                }
            });
            // var downloadUrl='https://img.shuixindk.cn/wxdownload.doc';
            var downloadUrl='https://img.tuanzidai.cn/loan/market/boluodai_2.3_sha3b74589b1187b7688822afe02115156c0fc08d69_120000_debug_20190123_17_55.apk';
            res.send(apiResult(200,downloadUrl,'返回成功',null))
        })
    }
}