var config = require('../config');//配置文件 appid 等信息 
var Q = require("q"); 
var request = require("request"); 
var crypto = require('crypto'); 
var ejs = require('ejs'); 
var fs = require('fs'); 
var key = ""; //此处为申请微信支付的API密码
var messageTpl = fs.readFileSync(__dirname + '/message.ejs', 'utf-8');
var WxPay = { 
    getXMLNodeValue: function(node_name, xml) { 
      var tmp = xml.split("<" + node_name + ">"); 
      var _tmp = tmp[1].split("</" + node_name + ">"); 
      return _tmp[0]; 
    }, 
   
    raw: function(args) { 
      var keys = Object.keys(args); 
      keys = keys.sort() 
      var newArgs = {}; 
      keys.forEach(function(key) { 
        newArgs[key] = args[key]; 
      }); 
      var string = ''; 
      for (var k in newArgs) { 
        string += '&' + k + '=' + newArgs[k]; 
      } 
      string = string.substr(1); 
      return string; 
    }, 
   
    paysignjs: function(appid, nonceStr, package, signType, timeStamp) { 
      var ret = { 
        appId: appid, 
        nonceStr: nonceStr, 
        package: package, 
        signType: signType, 
        timeStamp: timeStamp 
      }; 
      var string = this.raw(ret); 
      string = string + '&key=' + key; 
      var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex'); 
      return sign.toUpperCase(); 
    }, 
   
    paysignjsapi: function(appid, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) { 
      var ret = { 
        appid: appid, 
        attach: attach, 
        body: body, 
        mch_id: mch_id, 
        nonce_str: nonce_str, 
        notify_url: notify_url, 
        openid: openid, 
        out_trade_no: out_trade_no, 
        spbill_create_ip: spbill_create_ip, 
        total_fee: total_fee, 
        trade_type: trade_type 
      }; 
      var string = this.raw(ret); 
      string = string + '&key=' + key; //key为在微信商户平台(pay.weixin.qq.com)-->账户设置-->API安全-->密钥设置 
      var crypto = require('crypto'); 
      var sign = crypto.createHash('md5').update(string, 'utf8').digest('hex'); 
      return sign.toUpperCase(); 
    }, 
   
    // 随机字符串产生函数 
    createNonceStr: function() { 
      return Math.random().toString(36).substr(2, 15); 
    }, 
   
    // 时间戳产生函数 
    createTimeStamp: function() { 
      return parseInt(new Date().getTime() / 1000) + ''; 
    }, 
  // 此处的attach不能为空值 否则微信提示签名错误 
    order: function(attach, body, mch_id, openid, bookingNo, total_fee, notify_url) { 
      var deferred = Q.defer(); 
      var appid = ''; 
      var nonce_str = this.createNonceStr(); 
      var timeStamp = this.createTimeStamp(); 
      var url = "https://api.mch.weixin.qq.com/pay/unifiedorder"; 
      var formData = "<xml>"; 
      formData += "<appid>" + appid + "</appid>"; //appid 
      formData += "<attach>" + attach + "</attach>"; //附加数据 
      formData += "<body>" + body + "</body>"; 
      formData += "<mch_id>" + mch_id + "</mch_id>"; //商户号 
      formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。 
      formData += "<notify_url>" + notify_url + "</notify_url>"; 
      formData += "<openid>" + openid + "</openid>"; 
      formData += "<out_trade_no>" + bookingNo + "</out_trade_no>"; 
      formData += "<spbill_create_ip>61.50.221.43</spbill_create_ip>"; 
      formData += "<total_fee>" + total_fee + "</total_fee>"; 
      formData += "<trade_type>JSAPI</trade_type>"; 
      formData += "<sign>" + this.paysignjsapi(appid, attach, body, mch_id, nonce_str, notify_url, openid, bookingNo, '61.50.221.43', total_fee, 'JSAPI') + "</sign>"; 
      formData += "</xml>"; 
      var self = this; 
      request({ 
        url: url, 
        method: 'POST', 
        body: formData 
      }, function(err, response, body) { 
        if (!err && response.statusCode == 200) { 
          console.log(body); 
          var prepay_id = self.getXMLNodeValue('prepay_id', body.toString("utf-8")); 
          var tmp = prepay_id.split('['); 
          var tmp1 = tmp[2].split(']'); 
          //签名 
          var _paySignjs = self.paysignjs(appid, nonce_str, 'prepay_id=' + tmp1[0], 'MD5', timeStamp); 
          var args = { 
            appId: appid, 
            timeStamp: timeStamp, 
            nonceStr: nonce_str, 
            signType: "MD5", 
            package: tmp1[0], 
            paySign: _paySignjs 
          }; 
          deferred.resolve(args); 
        } else { 
          console.log(body); 
        } 
      }); 
      return deferred.promise; 
    }, 
   
    //支付回调通知 
    notify: function(obj) { 
      var output = ""; 
      if (obj.return_code == "SUCCESS") { 
        var reply = { 
          return_code: "SUCCESS", 
          return_msg: "OK" 
        }; 
   
      } else { 
        var reply = { 
          return_code: "FAIL", 
          return_msg: "FAIL" 
        }; 
      } 
   
      output = ejs.render(messageTpl, reply); 
      return output; 
    }, 
  }; 
  module.exports = WxPay; 