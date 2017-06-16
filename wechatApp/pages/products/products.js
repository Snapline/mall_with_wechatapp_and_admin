var API = require('../../request/API.js');

Page({
  data: {
    product: [],
    current: 1,
    indicatorDots: false
  },
  currentchange(e) {
    this.setData({
      current: e.detail.current + 1
    });
  },
  onLoad(options) {
    const productId = options.id;
    var that = this;
    wx.request({
      url: API.APIDomian + 'productInfo',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        that.setData({
          product: res.data
        })

      },
      fail: function () {
        API.failTips('广告活动请求错误，请重新请求')
      }
    })
    // var product = serviceData.productData;
    // product.goods_price = product.goods_price.toFixed(2);
    // this.setData({
    //   product,
    //   wxParseData: WxParse('html', product.goods_detail)
    // ,cartNum:2});

  },
  onShareAppMessage(event){
    console.log(event);
    return {
          title: '商品页',
          desc: this.data.product.goods_name,
          path: '/products/products?id=' + this.data.product.id
        }
  },
 
  navigateToCart() {
    wx.switchTab({
      url: '../cart/cart'
    });
  }
});
