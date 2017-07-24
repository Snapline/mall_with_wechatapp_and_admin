var API = require('../../request/API.js');
const app = getApp();
Page({
  data: {
    detailList: [],
    expressCompany:'233',
    expressId:'232',
    expressState: 0,
    orderId:''
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: API.APIDomian + '/wx/order/express_query',
      data: {
        orderId: options.orderid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': app.globalData.sessionId
      },
      success: function (res) {
        if (res.data.resp_code == '000000') {
          that.setData({
            orderId: options.orderid,
            expressCompany: res.data.result.express_company,
            expressId: res.data.result.express_id,
            expressState: res.data.result.state,
            detailList: res.data.result.data
          })
        }
        else if (res.data.resp_code == '400001') {
          wx.showModal({
            title: '无记录',
            content: '该订单无记录，请确认订单输入是否正确',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })

        }

      },
      fail: function () {
        showModal('网络请求错误，请重新请求')
      }
    })
    wx.showLoading({
      title: '加载中',
    })

    wx.setNavigationBarTitle({
      title: '订单详情'
    })
  },


  onShow: function () {
    setTimeout(function () {
      wx.hideLoading()
    }, 100);
  }
})

function showModal(content) {
  wx.showModal({
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {

      }
    }
  })
}