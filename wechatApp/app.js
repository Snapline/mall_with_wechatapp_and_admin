// import promiseFromWXCallback from './lib/promiseFromWXCallback';
// import request from './lib/request';
// import resource from './lib/resource';

// const login = promiseFromWXCallback(wx.login);
// const getUserInfo = promiseFromWXCallback(wx.getUserInfo);
// const wxRequest = promiseFromWXCallback(wx.request);
// // app.js

// App({
//   data : {
//     token : null,
//   },
//   onLaunch() {
//     console.log('第一次初始化');
//     this.getLoginInfo();
//   },
//   //获取登陆用户信息
//   getLoginInfo() {
//     var code = null;
//     var indexData = require("/data/config.js");
//     this.globalData.shopInfo = indexData.configData;
//     return login()
//       .then((res) => { code = res.code; return getUserInfo();})
//       .then(({ userInfo }) => {
//         var param = userInfo;
//         //code ='the code is a mock one'; //默认code
//         param.code = code;
//         param.app_id = this.globalData.appId;
//         //向服务云拿取用户
//         return resource.getUserInfo(param);
     
//       }) .then((promisData) => {
//         console.log(promisData);
//         if(promisData.statusCode == 200) {
          
//            this.globalData.userInfo = promisData.data;
//            wx.setStorage({
//               key:"token",
//               data:promisData.data.token,
//             });
//             this.globalData.token = promisData.data.token;
//             this.setData({token:promisData.data.token});
//         } else {
//           console.log(promisData);
//         }
//         //return  request({path:'/config?shop_id' + this.globalData.shop_id});
//       },(promis) => {
//         console.log(promis);
//       },(p) => {
//         console.log(p);
//       });
     
//   },
//   getUserInfo() {
//     return login()
//       .then(() => getUserInfo())
//       .then(({ userInfo }) => {
//         this.globalData.userInfo = userInfo;
//         return userInfo;
//       });
//   },
//   globalData: {
//   },
// });

//app.js
var API = require('request/API.js');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getSession: function (cb) {
    var that = this
    if (this.globalData.sessionId) {
      typeof cb == "function" && cb(this.globalData.sessionId)
    }
    else {
      //调用登录接口
      var that = this;
      wx.login({
        success: function (res) {
          wx.request({
            url: API.APIDomian + 'wx/auth/login',
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: {
              code: res.code
            },
            success: function (res) {
              //存储session
              that.globalData.sessionId = res.data.session;
              typeof cb == "function" && cb(that.globalData.sessionId);
            }
          });

        }
      })
    }
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }
    else {
      //调用登录接口
      var that = this;
      wx.login({
        success: function (res) {
          wx.request({
            url: API.APIDomian + '/wx/auth/login',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: {
              code: res.code
            },
            success: function (res) {
              //存储session
              that.globalData.sessionId = res.data.session;

              wx.getUserInfo({
                success: function (resInfo) {
                  that.globalData.userInfo = resInfo.userInfo;
                  typeof cb == "function" && cb(that.globalData.userInfo);
                  //向后台传输保存用户信息
                  wx.request({
                    url: API.APIDomian + '/wx/user/check',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                      'Cookie': that.globalData.sessionId
                    },
                    method: 'POST',
                    data: {
                      'nickName': resInfo.userInfo.nickName,
                      'gender': resInfo.userInfo.gender,
                      'language': resInfo.userInfo.language,
                      'city': resInfo.userInfo.city,
                      'province': resInfo.userInfo.province,
                      'country': resInfo.userInfo.country,
                      'avatarUrl': resInfo.userInfo.avatarUrl,
                      'signature': resInfo.signature,
                      'rawData': resInfo.rawData,
                      'encryptedData': resInfo.encryptedData,
                      'iv': resInfo.iv
                    },
                    success: function (res) {
                      console.log(res.data)
                    }
                  })
                },
                fail: function () {
                  wx.showModal({
                    content: '您已拒绝授权个人资料，部分功能将无法使用！'
                  })
                }
              })
            }
          });

        }
      })
    }
  },
  globalData: {
    userInfo: null,
    sessionId: null
  }
})