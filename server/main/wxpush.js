//利用superagent模块快速请求微信服务器，获取返回token进行存储
const wxrequest = require('superagent');
const express = require('express');
const app = express();
const apiResult=require('../utils/apiResult');

//小程序常规参数
var APPID='wxc8ee2be24346f5d8';
var APPSECRET='11fffcc718b1ca93fcf58d4a3f66b7c8';

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
function getToken(){
    //获取小程序调用凭证接口
    app.get('/getToken',(req,result)=>{
        var tokenapi=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
        wxrequest.get(tokenapi).end((req,res)=>{
            if(res!==undefined){
                console.log(res.body,'请求微信接口');
                result.send(apiResult(200,res.body,'返回成功',null));
                return res.body.access_token;
            }else{
                result.send(apiResult(500,null,'系统错误，请稍后重试','系统错误，请稍后重试'))
            }
        })
    })
}

//获取小程序openid接口
app.get('/getOpenid',(req,res)=>{
    console.log(JSON.stringify(req.query.code),'检测请求参数');
    let code=req.query.code;
    var openidapi=`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`
    wxrequest.get(openidapi).end((req1,res1)=>{
        if(res1){
            console.log(res1.text,'检测请求返回');
            console.error(res1.text);
            res.send(apiResult(200,JSON.parse(res1.text),'返回成功',null))
        }else{
            res.send(apiResult(404,null,'404 notfound!!','404 notfound!!'));
        }
    })
})

//发送小程序统一推送模版接口
app.get('/wxpush',(req,res)=>{
    var tokenapi=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;
    // let code=req.query.code;
    // var openidapi=`https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`;
    wxrequest.get(tokenapi).end((req1,res2)=>{
        console.log(res2.body.access_token)
        var wxpushapi=`https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${res2.body.access_token}`;
        let data={
            touser: "oipRc5ZpSRwR_dkCADYMhnhT-S5A",//openId
            template_id: 'Uvm6DOudBIdxlElkVnM8OhAhB4CxBmKhmkbBGAM0S44',//模板消息id，  
            page: 'pages/index',//点击详情时跳转的主页
            form_id: req.query.formID,//formID
            data: {//下面的keyword*是设置的模板消息的关键词变量  
            
                "keyword1": {
                "value": "keyword1",
                "color": "#4a4a4a"
                },
                "keyword2": {
                "value": "keyword2",
                "color": "#9b9b9b"
                },
                "keyword3": {
                "value": "keyword3",
                "color": "red"
                }
        }}
        wxrequest.post(wxpushapi).send(data).end((req2,res2)=>{
            console.log(res2.text,'检测推送返回');
            res.send(apiResult(200,{},'推送成功',{}))
        })
    })
})

app.listen(6789);
