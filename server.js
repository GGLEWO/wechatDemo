/*
 * @Author: guanyaoming guanyaoming@
 * @Date: 2023-04-19 11:01:08
 * @LastEditors: guanyaoming guanyaoming@
 * @LastEditTime: 2023-04-20 16:11:47
 * @FilePath: \code\server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const Koa = require("koa");
const app = new Koa();
const config = require("./config");
const API = require("./wechat/access_token");
const api = new API(config);

const menu = {
  button: [
    {
      type: "click",
      name: "AI画图",
      key: "V1001_TODAY_MUSIC",
    },
    {
      name: "菜单",
      sub_button: [
        {
          type: "view",
          name: "AI对话",
          url: "http://www.soso.com/",
        },
      ],
    },
  ],
};

// 引入验证微信服务器的有效性
// const auth = require("./wechat/auth");
// app.use(auth());

const createMenu = async function () {
  const data = await api.createMenu(menu);
};
createMenu();

// co-wechat 接收消息并且回复
const wechat = require("co-wechat");
app.use(
  wechat(config).middleware(async (message, ctx) => {
    console.log(message);

    if (message.Content === "1") {
      return {
        type: "text",
        content: "自动回复1",
      };
    } else {
      return "自动回复2";
    }
  })
);

// 回复功能
// 测试ejs模板的功能
/* const ejs = require('ejs');
let tpl = `
<xml> 
 <ToUserName><![CDATA[<%-toUsername%>]]></ToUserName> 
 <FromUserName><![CDATA[<%-fromUsername%>]]></FromUserName> 
 <CreateTime><%=createTime%></CreateTime> 
 <MsgType><![CDATA[<%=msgType%>]]></MsgType> 
 <Content><![CDATA[<%-content%>]]></Content> 
</xml>
`;
const compiled = ejs.compile(tpl);
const msgXML = compiled({
  toUsername:'接收方的账号',
  fromUsername:'开发者账号',
  createTime:new Date().getTime(),
  msgType:'text',
  content:'你好'
})
console.log(msgXML);
 */

app.listen("8000", () => {
  console.log("服务器启动在8000端口上");
});
