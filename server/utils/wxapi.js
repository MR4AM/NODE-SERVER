//微信公众号及小程序api常用接口
//小程序id及密钥
const MINI_APPID='wxc8ee2be24346f5d8';
const MINI_APPSECRET='11fffcc718b1ca93fcf58d4a3f66b7c8';
//公众号id及密钥
const PUBLIC_APPID='wx915d308cf5228962';
const PUBLIC_APPSECRET='b4a4a510465c41993a559f63cdac6bed';
//公众号获取接口调用token接口
const PUBLIC_ACCESSTOKEN=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${PUBLIC_APPID}&secret=${PUBLIC_APPSECRET}`;
//微信接口返回的token(测试阶段暂时hardcode)
const ACCESS_TOKEN='17_T2k36SnbHXMKDCAPNVYW2R7etmnqgmRpcN1syDfuBJyPZK6w7BrQILysvIH6ARunZgkjLl-BDLE--gwrTzD0B0ndfeob4CO1dC-gUbRKhddoheVovT6HGRI32Spuap43nXR_p2AgFYAxT7zLARZcAFAGXF';
//公众号获得jsapi_ticket
const JSAPI_TICKET=`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${ACCESS_TOKEN}&type=jsapi`;
let PUBLIC_API={
   PUBLIC_ACCESSTOKEN,
   JSAPI_TICKET,
}
module.exports=PUBLIC_API;