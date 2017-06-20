// pages/addcart/addcart.js
var API = require('../../request/API.js');
var app = getApp();
Page({

  data: {
    productName:'',
    productId:'',
    price:'',
    buyNumber: 1,
    storeNum:10
  },
  bindBuyNumChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  //减少数量
  minusNumber(e){
    if (this.data.buyNumber>1){
      var tempNum = this.data.buyNumber;
      tempNum = tempNum - 1;
      this.setData({
        buyNumber: tempNum
      })
    }
  },

  //增加数量
  addNumber(e) {
    console.log(this.data.storeNum)
    if (this.data.buyNumber < this.data.storeNum) {
      var tempNum = this.data.buyNumber + 1;
      this.setData({
        buyNumber: tempNum
      })
    }
  },

  //加入购物车
  addCar(e){
    var that = this;
    wx.request({
      url: API.APIDomian + '/wx/shopcart/add',
      data: {
        'num': that.data.buyNumber,
        'item_id': that.data.productId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': app.globalData.sessionId
      },
      success: function (res) {
        if (res.data.resp_code == '000000'){
          wx.switchTab({
            url: '../cart/cart'
          });
        }
        

      },
      fail: function () {
        API.failTips('购物车添加失败，请重新添加')
      }
   })
  },
  onLoad:function (options) {
      this.setData({
        productName: options.name,
        price: options.price,
        productId: options.productId,
        buyNumber:1,
        storeNum: options.remain
      })
  },

 
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})