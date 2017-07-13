var API = require('../../request/API.js');
var app = getApp();
Page({
  data: {
    //广告牌轮播图数组
    banners: [],
    features: [],
    bottomNum: 1,
    hasToEnd: false,
    apiHeader: API.APIDomian
  },
  //进入商品详情
  navigateToProduct(event) {
    var productId = event.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: '../products/products?id=' + productId
    });
  },

  //进入广告牌详情
  navigateToActivity(event) {
    var productId = event.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: '../products/products?id=' + productId
    });
  },

  onLoad() {
    app.getUserInfo();
    this.setData({ shop_info: app.globalData.shopInfo });
    // this.setData({banners: serviceData.bannerData, activities:serviceData.activityData, features:serviceData.featureData});

    var that = this;
    //获取广告牌推荐
    wx.request({
      url: API.APIDomian + '/wx/recommend/list',
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        var arr = [];
        var dataArr = res.data.result;
        for(var i = 0; i<dataArr.length; i++){
          var obj = {
            'id': dataArr[i].id,
            'image_url': API.APIDomian+ dataArr[i].pic_url_resize
          }
          arr.push(obj)
        }
        that.setData({
          banners: arr
        })

      },
      fail: function () {
        API.failTips('广告活动请求错误，请重新请求')
      }
    })

    //获取新品推荐
    getRecommends(that);
  },
  
  onReachBottom: function() {
    if (!this.data.hasToEnd) {
      var tempCount = this.data.bottomNum;
      this.setData({
        bottomNum: tempCount + 1
      });
      getRecommends(this)
    }
    else{
      API.failTips('已经到底啦！')
    }
   
  }
});

function getRecommends(that){
  wx.request({
    url: API.APIDomian + '/wx/stars/list',
    data: {
      'page_num': that.data.bottomNum,
      'per_page': 4
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

      if (that.data.bottomNum==res.data.result.total_page){
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
