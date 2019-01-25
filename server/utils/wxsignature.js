//node 利用crypoto模块对微信签名算法进行sha1加密
let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('不支持 crypto!');
}
var CryptoJS = require('crypto-js');
const sha1 = require('sha1');
var wxsignature = {
    //生成随机字符串
    render_noncestr(length) {
        length = length || 15;
        var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var noncestrarr = [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
        ];
        var strlen = str.length;
        var noncestr = '';
        for (i = 0; i < length; i++) {
            noncestr += str.charAt(Math.floor(Math.random() * strlen));
        }
        return noncestr;

    },
    //生成时间戳
    render_timestamp(){
        return  Date.parse(new Date());
    },
    //sha1加密
    sha1(ticket){
        //当前网页
        let url='http://23w4962t28.imwork.net';
        let configPar={};
        configPar.appId='wx915d308cf5228962';
        configPar.noncestr=this.render_noncestr();
        configPar.timestamp=this.render_timestamp();
        let signature=`jsapi_ticket=${ticket}noncestr=${configPar.noncestr}timestamp=${configPar.timestamp}url=${url}`;
        //该模块针对部分数据加密的结果，与其他语言加密的结果会不一致，因此采用第二种方式
        // let sha1=crypto.createHash('sha1').update(signature,'utf-8').digest('hex');   //16进制
        // var key = 'REzySUKRCPfyfV/jfgwTA==';
        // let sha1=CryptoJS.HmacSHA1(signature,key).toString();
        let nodesha1=sha1(signature); 
        configPar.signature=nodesha1;
        return configPar; 
    }
}
module.exports =  wxsignature;