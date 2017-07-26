var API = require('../../request/API.js');

const app = getApp();
Page({
  data: {
    commentList:[],
    itemId: 0,
    bottomNum: 1,
    hasToEnd: false,
    apiHeader: ''
  },

  onLoad: function (options) {
    const that = this;
    that.setData({
      itemId: options.itemId
    })
    commentquery(that)
  },

  onReachBottom: function () {
    if (!this.data.hasToEnd) {
      var tempCount = this.data.bottomNum;
      this.setData({
        bottomNum: tempCount + 1
      });
      commentquery(this)
    }
    else {
      API.failTips('没有更多的评论啦')
    }
  },

  //放大图片
  zoomPics:function(e){
    const commentIndex = e.currentTarget.dataset.commentindex;
    const currentImg = e.currentTarget.dataset.imgsrc;
    const that = this;
    var urlsArr = [];
    that.data.commentList[commentIndex].pic.forEach(function(item){
      urlsArr.push(item.full_url)
    })
    wx.previewImage({
      current: currentImg,
      urls: urlsArr
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})

function commentquery(that) {
  wx.request({
    url: API.APIDomian + '/wx/item/comment',
    data: {
      'item_id': that.data.itemId,
      'per_page': 10,
      'page_num': that.data.bottomNum
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Cookie': app.globalData.sessionId
    },
    success: function (res) {
      var resJson = res.data.result.data;
      res.data.result.data.forEach(function(item){
        item.pic.forEach(function(oItem){
          oItem.full_url = API.APIDomian + oItem.pic_url_resize
        })
        
      });
      var previousCommmentData = that.data.commentList;
      for (var i = 0; i < resJson.length; i++) {
        resJson[i].apiHeader = API.APIDomian
        previousCommmentData.push(resJson[i])
      }

      that.setData({
        commentList: previousCommmentData
      })

      if (that.data.bottomNum == res.data.result.total_page) {
        that.setData({
          hasToEnd: true
        })
      }
    },
    fail: function () {
      API.failTips('获取评论信息失败，请重新请求')
    }
  })
}