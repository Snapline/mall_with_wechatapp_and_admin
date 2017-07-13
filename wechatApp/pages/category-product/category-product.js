var API = require('../../request/API.js');
Page({
  data: {
    features: [],
    bottomNum: 1,
    hasToEnd: false,
    cateName: '',
    apiHeader: API.APIDomian
  },
  //进入商品详情
  navigateToProduct(event) {
    var productId = event.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: '../products/products?id=' + productId
    });
  },

  onLoad(options) {
    this.setData({
      cateName: options.name
    });
    var that = this;
    //获取商品
    getGoodsByCate(that, options.cateId);
  },

  onReachBottom: function () {
    if (!this.data.hasToEnd) {
      var tempCount = this.data.bottomNum;
      this.setData({
        bottomNum: tempCount + 1
      });
      getRecommends(this)
    }
    else {
      API.failTips('没有更多啦！')
    }

  }
});

function getGoodsByCate(that, cateId) {
  wx.request({
    url: API.APIDomian + '/wx/category/item',
    data: {
      'page_num': that.data.bottomNum,
      'per_page': 10,
      'category_id': cateId
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    success: function (res) {
      var resJson = res.data.result.data;
      var previousGoodsData = that.data.features;
      for (var i = 0; i < resJson.length; i++) {
        previousGoodsData.push(resJson[i])
      }

      that.setData({
        features: previousGoodsData
      })

      if (that.data.bottomNum == res.data.result.total_page) {
        that.setData({
          hasToEnd: true
        })
      }

    },
    fail: function () {
      API.failTips('请求失败，请重新请求')
    }
  })
}
