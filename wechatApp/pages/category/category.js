
var API = require('../../request/API.js');

//获取应用实例
var app = getApp()
Page({
  data: {
    albumArray: [],
    showArr: [],
    hasType: false,
    hasNoAlbum: false,
    bottomNum: 1,
    hasToEnd: false,
    apiHeader: API.APIDomian
  },
  //进入类别详情
  showGoodsInCate: function (e) {
    var targetAlbumId = e.target.dataset.id;
    var targetAlbumName = e.target.dataset.name;
    console.log(targetAlbumId)
    wx.navigateTo({
      url: '../category-product/category-product?cateId=' + targetAlbumId + '&name=' + targetAlbumName
    })
  },

  onReachBottom: function () {
    //到底刷新  
    if (!this.data.hasToEnd) {
      var tempCount = this.data.bottomNum;
      this.setData({
        bottomNum: tempCount + 1
      });
      getAlbums(this)
    }
  },

  onLoad: function () {
    var that = this;
    getAlbums(that)
  }
})

function getAlbums(that) {
  wx.request({
    url: API.APIDomian + '/wx/category/list',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    data: {
      'page_num': that.data.bottomNum,
      'per_page': 10
    },
    success: function (res) {
      var resJson = res.data.result.data;
      var previousCateData = that.data.albumArray;
      for (var i = 0; i < resJson.length; i++) {
        previousCateData.push(resJson[i])
      }

      that.setData({
        albumArray: previousCateData
      })

      if (that.data.bottomNum == res.data.result.total_page) {
        that.setData({
          hasToEnd: true
        })
      }
    },
    fail: function (e) {
      API.failTips('类别请求失败，请重新请求')
    }
  })
}