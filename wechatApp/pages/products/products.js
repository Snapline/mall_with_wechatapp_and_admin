var API = require('../../request/API.js');

Page({
  data: {
    swipePic:[],
    product: [],
    descPics:[],
    itemId:0,
    indicatorDots: true,
    commentInfo:[], //第一条评论的信息
    commentNum:0,
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
          swipePic: res.data.result,
          itemId: productId
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

    //获取评论信息
    wx.request({
      url: API.APIDomian + '/wx/item/comment',
      data: {
        'item_id': productId,
        'per_page': 1,
        'page_num': 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        if (res.data.result.total_num){
          res.data.result.data.forEach(function (item) {
            item.pic.forEach(function (oItem) {
              oItem.full_url = API.APIDomian + oItem.pic_url_resize
            })

          });
          that.setData({
            commentInfo: res.data.result.data,
            commentNum: res.data.result.total_num
          })
        }
        
        
      },
      fail: function () {
        API.failTips('获取评论信息失败，请重新请求')
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

  //放大评论图片
  zoomPics: function (e) {
    const currentImg = e.currentTarget.dataset.imgsrc;
    const that = this;
    var urlsArr = [];
    that.data.commentInfo[0].pic.forEach(function (item) {
      urlsArr.push(item.full_url)
    })
    wx.previewImage({
      current: currentImg,
      urls: urlsArr
    })
  },

  //查看更多评论
  moreComment(){
    const that = this;
    wx.navigateTo({
      url: '../comment/comment?itemId='+that.data.itemId,
    })
  },

  //跳到购物车页面
  navigateToCart(){
    wx.switchTab({
      url: '../cart/cart'
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
