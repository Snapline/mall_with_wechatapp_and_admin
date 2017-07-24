var API = require('../../request/API.js');

const app = getApp();
Page({
  data: {
    loading: false,
    orderList: [],
    stars:[],
    imageList:[],
    commentList:[],
    orderId:'2017072117183660002'
  },
  onLoad(optios) {
    app.getUserInfo();
    const that = this;
    setTimeout(function(){
      wx.request({
        url: API.APIDomian + '/wx/order/query_detail',
        data: {
          'orderId': '2017072117183660002'
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'Cookie': app.globalData.sessionId
        },
        success: function (res) {
          var starsArr = [];
          var ImageArr = [];
          var commentArr =[];
          res.data.result.data.items.forEach(function (item) {
            item.apiHeader = API.APIDomian;
            starsArr.push(5);
            ImageArr.push([]);
            commentArr.push('');
          });
          that.setData({
            orderList: res.data.result.data,
            stars: starsArr,
            imageList: ImageArr,
            commentList: commentArr
          });

        },
        fail: function () {
          API.failTips('获取订单信息失败，请重新请求')
        }
      })
    },1000)
   

  },


  //评星打分
  changeStar1: function (e) {
    const oIndex = e.currentTarget.dataset.itemindex;
    var starsArr = this.data.stars;
    starsArr[oIndex] = 1;
    console.log(oIndex)
    this.setData({
      stars: starsArr
    })
   
  },

  changeStar2: function (e) {
    const oIndex = e.currentTarget.dataset.itemindex;
    var starsArr = this.data.stars;
    starsArr[oIndex] = 2;
    console.log(oIndex)
    this.setData({
      stars: starsArr
    })

  },

  changeStar3: function (e) {
    const oIndex = e.currentTarget.dataset.itemindex;
    var starsArr = this.data.stars;
    starsArr[oIndex] = 3;
    console.log(oIndex)
    this.setData({
      stars: starsArr
    })

  },

  changeStar4: function (e) {
    const oIndex = e.currentTarget.dataset.itemindex;
    var starsArr = this.data.stars;
    starsArr[oIndex] = 4;
    console.log(oIndex)
    this.setData({
      stars: starsArr
    })

  },

  changeStar5: function (e) {
    const oIndex = e.currentTarget.dataset.itemindex;
    var starsArr = this.data.stars;
    starsArr[oIndex] = 5;
    console.log(oIndex)
    this.setData({
      stars: starsArr
    })

  },

  //留下评语
  inputComment(e){
    const oIndex = e.currentTarget.dataset.itemindex;
    var commentArr = this.data.commentList;
    commentArr[oIndex] = e.detail.value
    this.setData({
      commentList: commentArr
    })
  },

  //选择图片上传
  chooseImage: function (e) {
    const oIndex = e.currentTarget.dataset.itemindex;
    var that = this;
    var countdown = 5 - this.data.imageList[oIndex].length;
    wx.chooseImage({
      count: countdown,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        var previousImageList = that.data.imageList;
        var previousImageListItem = previousImageList[oIndex];
        var currentImageList = res.tempFilePaths;
        for (var i = 0; i < currentImageList.length; i++) {
          previousImageListItem.push(currentImageList[i]);
        }
        console.log(previousImageListItem)
        
        previousImageList[oIndex] = previousImageListItem;
        that.setData({
          imageList: previousImageList
        })
      }
    })
  },

  //删除图片
  deleteImage: function (e) {
    //首先确定是哪一个商品序列的索引
    const oIndex = e.currentTarget.dataset.index;
    //然后确定是这个商品里N张图的哪一个索引
    var _index = e.currentTarget.dataset.itemindex;
    console.log(oIndex)
    console.log(_index)
    var previousArr = this.data.imageList;
    var that = this;
    wx.showModal({
      content: '确认取消该图片上传？',
      success: function (res) {
        if (res.confirm) {
          //确认删除
          previousArr[oIndex].splice(_index, 1);
          that.setData({
            imageList: previousArr
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  //提交评价
  uploadComment(){
    const that= this;
    var imageList = that.data.imageList;
    for (var i = 0; i < imageList.length; i++) {
      uploadContent(i, that);
    }
  }
})

function uploadContent(index, that) {
  var imageListItem = that.data.imageList[index];
  if (imageListItem.length==0){
    wx.request({
      url: API.APIDomian + '/wx/comment/add',
      data: {
        'itemId': that.data.orderList.items[index].itemId,
        'orderId': that.data.orderId,
        'comment': that.data.commentList[index],
        'stars': that.data.stars[index],
        'file':''
      },
      method: 'POST',
      header: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': app.globalData.sessionId
      },
      success: function (res) {
        console.log(res)
      },
      fail: function () {
        API.failTips('评论失败')
      }
    })

  }
  else{
    for (var j = 0; j < imageListItem.length; j++) {
      console.log(that.data.orderList.items[index].itemId)
      wx.uploadFile({
        url: API.APIDomian + '/wx/comment/add',
        filePath: that.data.imageList[index][j],
        name: 'file',
        formData: {
          'itemId': that.data.orderList.items[index].itemId,
          'orderId': that.data.orderId,
          'comment': that.data.commentList[index],
          'stars': that.data.stars[index]
        },
        header: {
          "Content-Type": "multipart/form-data",
          'Cookie': app.globalData.sessionId
        },
        method:'POST',
        success: function (res) {

          console.log(res)
        },
        fail: function (e) {
          console.log(e);
          wx.showModal({
            title: '提示',
            content: '评论失败',
            showCancel: false
          })
        }
      })
    }
  }

   
}