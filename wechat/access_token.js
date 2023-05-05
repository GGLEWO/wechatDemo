/*
 * @Author: guanyaoming guanyaoming@
 * @Date: 2023-04-19 11:01:08
 * @LastEditors: guanyaoming guanyaoming@linklogis.com
 * @LastEditTime: 2023-05-05 10:26:00
 * @FilePath: \code\wechat\access_token.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const axios = require("axios");
const fs = require("fs");
class API {
  constructor({ appID, appSecret }) {
    this.appID = appID;
    this.appSecret = appSecret;
    this.prefix =
      "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=";
    // 保存access_token
    this.saveAccessToken = function (token) {
      return new Promise((resolve, reject) => {
        fs.writeFile("access_token.txt", JSON.stringify(token), (err) => {
          if (err) {
            return reject(err);
          }
          resolve({ data: "成功保存 access_token" });
        });
      });
    };
    // 获取access_token
    this.getAccessToken = function () {
      return new Promise((resolve, reject) => {
        fs.readFile("access_token.txt", "utf-8", (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(JSON.parse(data));
        });
      });
    };
  }
  // 发起请求 获取access_token的方法
  async get_access_token() {
    let token = {};
    const res = await axios.get(
      `${this.prefix}${this.appID}&secret=${this.appSecret}`
    );
    // 记录返回的过期时间，并提前 20 秒
    const expiresTime = Date.now() + (res.data.expires_in - 20) * 1000;
    token.accessToken = res.data.access_token;
    token.expiresTime = expiresTime;
    // 存储access_token到文件中
    let msg = await this.saveAccessToken(token);
    return token;
  }
  // 读取文件获取token,读取失败 重新请求接口
  async ensureAccessToken() {
    let token = {};
    // 获取文件中的数据
    try {
      token = await this.getAccessToken();
    } catch (error) {
      // 读取文件失败 重新请求接口
      token = await this.get_access_token();
    }
    // 验证access_token是否过期
    if (token && this.isValid(token)) {
      // 没有过期
      return token;
    }
    // 证明已经过期
    return this.get_access_token();
  }
  // 验证access_token是否过期
  isValid({ accessToken, expiresTime }) {
    return !!accessToken && Date.now < expiresTime;
  }
  // 创建自定义的菜单
  async createMenu(menu) {
    // 先获取accessToken的值
    const { accessToken } = await this.ensureAccessToken();
    const res = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`,
      menu
    );
    return res.data;
  }
}
module.exports = API;
