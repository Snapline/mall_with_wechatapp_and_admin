var API = require('../../request/API.js');

Page({
  data: {
    swipePic:[],
    product: [],
    descPics:[],
    indicatorDots: true,
    apiHeader: API.APIDomian
  },
  currentchange(e) {
    this.setData({
      current: e.detail.current + 1
    });
  },
  onLoad(options) {
    const productId = options.id;
    var that = this;

    //获取轮播图信息
    wx.request({
      url: API.APIDomian + '/wx/item/pic',
      data: {
        'item_id': productId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        that.setData({
          swipePic: res.data.result
        })

      },
      fail: function () {
        API.failTips('宝贝信息请求失败，请重新请求')
      }
    })

    //获取描述信息
    wx.request({
      url: API.APIDomian + '/wx/item/info',
      data: {
        'item_id': productId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        that.setData({
          product: res.data.result
        })

      },
      fail: function () {
        API.failTips('宝贝信息请求失败，请重新请求')
      }
    })

    //获取详情图信息
    wx.request({
      url: API.APIDomian + '/wx/item/desc_pic',
      data: {
        'item_id': productId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        that.setData({
          descPics: res.data.result
        })

      },
      fail: function () {
        API.failTips('宝贝信息请求失败，请重新请求')
      }
    })

  },
  onShareAppMessage(event){
    console.log(event);
    return {
          title: '商品页',
          desc: this.data.product.goods_name,
          path: '/products/products?id=' + this.data.product.id
        }
  },
 
  addCar(e) {
    const productID = e.currentTarget.dataset.productid;
    const productName = e.currentTarget.dataset.productname
    const price = e.currentTarget.dataset.price;
    const numTotal = e.currentTarget.dataset.storenum;
    const soldNum = e.currentTarget.dataset.soldnum;
    const remainNum = numTotal-soldNum;
    console.log(remainNum)
    wx.navigateTo({
      url: '../addcart/addcart?productId=' + productID + '&price=' + price+'&remain='+remainNum+'&name='+productName
    });
  }
});
