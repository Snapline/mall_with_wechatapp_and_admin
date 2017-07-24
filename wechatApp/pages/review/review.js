var API = require('../../request/API.js');

const app = getApp();
Page({
  data: {
    loading: false,
    flag2: 5,
    orderList: []
  },
  onLoad(optios) {
    app.getUserInfo();
    const that = this;
    setTimeout(function(){
      wx.request({
        url: API.APIDomian + '/wx/order/query_detail',
        data: {
          'orderId': '2017072020562360002'
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'Cookie': app.globalData.sessionId
        },
        success: function (res) {
          res.data.result.data.items.forEach(function (item) {
            item.apiHeader = API.APIDomian
          });
          that.setData({
            orderList: res.data.result.data
          })
        },
        fail: function () {
          API.failTips('获取订单信息失败，请重新请求')
        }
      })
    },1000)
   

  },

  changeColor11: function () {
    var that = this;
    that.setData({
      flag2: 1
    });
  },
  changeColor12: function () {
    var that = this;
    that.setData({
      flag2: 2
    });
  },
  changeColor13: function () {
    var that = this;
    that.setData({
      flag2: 3
    });
  },
  changeColor14: function () {
    var that = this;
    that.setData({
      flag2: 4
    });
  },
  changeColor15: function () {
    var that = this;
    that.setData({
      flag2: 5
    });
  }

})
