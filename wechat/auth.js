// 微信要求验证服务器的有效性，服务器计算出 signature 微信加密签名和微信传递来的 signature 进行对比，相同的话，返回 echostr 参数
const config = require("../config");
const sha1 = require("sha1");
module.exports = () => {
  return async (ctx) => {
    if (ctx.method === "GET") {
      const { signature, echostr, timestamp, nonce } = ctx.query;
      const { token } = config;
      // 1、微信签名的三个参数（timestamp，nonce，token）按照字典中数据组合成一个数组
      //  2、将数组里的属性拼接成一个字符串，进行sha1加密
      const sha1Str = sha1([timestamp, nonce, token].join(""));
      if (sha1Str === signature) {
        return (ctx.body = echostr);
      }
    } else if (ctx.method === "POST") {
      // post接收数据
    }
  };
};

/*
{
  signature: 'c110a3eb292c7311514753d2f8af57abb7a907c7',
  echostr: '1511634129629478903',
  timestamp: '1592360802',
  nonce: '157611452'
}
*/
