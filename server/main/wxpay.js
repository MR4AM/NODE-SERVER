//引入微信支付主流程
const request =require('request');
const Wxpay = require('../utils/wxpaymain');

module.exports = {
  //获取wx配置的用户openid
  accessOpenid(){
    app.post('/accessOpenid', (req, res) => {
      var params = req.body; 
      var url="https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code";
        url = url.replace("APPID",APP_ID);//你的app_id
        url = url.replace("SECRET",APP_SECRET);//你的aoo_secret
        url = url.replace("CODE",params.code);//传上来的code
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("openid",body);
            jsonWrite(res, body);
        }
      });
    })
  },
  //获取Token
  accessToken(){
    request.get({
      uri: 'https://api.weixin.qq.com/cgi-bin/token',
      json: true,
      qs: {
       grant_type: 'client_credential',
       appid: APPID, // APPID请换成你的 appid
       secret: APPSECRET // APPSECRET请换成你的 appsecret
      }
     }, (err, res, body) => {
      if (err) {
       console.log(err)
       return
      }
      console.log(body)
      if (body.errcode) {
       // 返回错误时的处理
       console.log("请求token错误！");
       return
      }else{
        var token = body.access_token;
        console.log("请求token成功",token);
        access_token=token;
      module.exports.access_token = access_token;
      var rule = new schedule.RecurrenceRule();//建立计时器
      var times = [];
      　　for(var i=1; i<60; i++){
      　　　　times.push(i);
      　　}
      rule.second = times;//每一秒都在进行判断 schedule没有7200ms所以我想到了没秒都执行用reqtime来起到计时的作用
      var reqtime = 0;//请求时间
      var j = schedule.scheduleJob(rule, function(){
        reqtime =reqtime+1;
        if(reqtime > 7199){//到了7200秒后 重新申请access_token
          reqtime = 0;
          getToken();
        }
      });
      j;
      }
    })
  },
  //获取用户ip
  getClientIp(req) {
      return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  },
  wxpay(app) {

    //微信支付接口
    app.post('/towxpay', function (req, res, next) {
      var attach = "123";
      var body = "text";
      var mch_id = "150096****"; //商户ID 
      var openid = req.body.openId;
      var bookingNo = req.body.orderid; //订单号 
      var total_fee = req.body.ordersall * 100; //以分为单位
      console.log("请求体", req.body);
      var notify_url = "http://*****.cn/notify"; //通知地址
      var spbill_create_ip = getClientIp(req); //这里获取用户ip
      if (spbill_create_ip.split(",").length > 1) {
        spbill_create_ip = spbill_create_ip.split(",")[0];
      }
      console.log("支付请求", attach, body, mch_id, openid, bookingNo, total_fee, notify_url, spbill_create_ip);
      Wxpay.order(attach, body, mch_id, openid, bookingNo, total_fee, notify_url, spbill_create_ip).then(function (data) {
        console.log("支付返回", data);
        jsonWrite(res, data);
      });
    });
  }
}