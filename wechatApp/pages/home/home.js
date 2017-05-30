var API = require('../../request/API.js');
var app = getApp();
Page({
  data: {
    shop_id: app.globalData.shop_id,
    shop_info:[],
    //广告牌轮播图数组
    banners: [],
    activities: [],
    features: [],
    currentPage: 1,
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
    var activityType = event.currentTarget.dataset.activityType;
    var activityId = event.currentTarget.dataset.activityId;
    var activityTitle = event.currentTarget.dataset.activityTitle;
    var activityUrl;
    switch (activityType) {
      case 1:
        activityUrl = "../category-product/category-product?id=" + activityId + '&title=' + activityTitle;
        break;
      case 2:
        activityUrl = "../products/products?id=" + activityId;
        break;
      case 3:
        activityUrl = event.currentTarget.dataset.activityUrl;
        break;
      default:
        break;
    }
    console.log(activityUrl);
    wx.navigateTo({
      url: activityUrl
    });
  },

  onLoad() {
    this.setData({ shop_info: app.globalData.shopInfo });
    // this.setData({banners: serviceData.bannerData, activities:serviceData.activityData, features:serviceData.featureData});

    var that = this;
    //获取广告牌推荐
    wx.request({
      url: API.APIDomian + 'bannerdata',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        that.setData({
          banners: res.data
        })

      },
      fail: function () {
        API.failTips('广告活动请求错误，请重新请求')
      }
    })

    //获取新品推荐
    wx.request({
      url: API.APIDomian + 'featuredata',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        that.setData({
          features: res.data
        })

      },
      fail: function () {
        API.failTips('请求失败，请重新请求')
      }
    })
  },
  
  lower: function() {
    console.log('lower more features data');
    API.failTips('下拉了哦！')
  }
});
