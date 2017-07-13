import resource from '../../lib/resource';
var API = require('../../request/API.js');
const app = getApp();

Page({
  data: {
    userInfo: {},
    order: {
      icon: 'images/order.png',
      text: '我的订单',
      tip: '',
      url: '../orders/orders?t=all'
    },
    // 收货付款数量
    orderBadge: {
      unpaid: 0,
      undelivered: 0,
      unreceived: 0
    },
    orderCell: [
      {
        icon: 'images/to-be-paid.png',
        text: '待付款',
        url: '../orders/orders?t=unpaid',
        class: 'order-cell-icon-small'
      }, {
        icon: 'images/to-be-delivered.png',
        text: '待发货',
        url: '../orders/orders?t=undelivered',
        class: 'order-cell-icon-small',
      }, {
        icon: 'images/to-be-received.png',
        text: '待收货',
        url: '../orders/orders?t=unreceived',
        class: 'order-cell-icon-big'
      }
    ],
    list: [
      {
        icon: 'images/address.png',
        text: '地址管理',
        tip: '',
        cut: true,
        url: '../addresses/addresses'
      }, {
        icon: 'images/tel.png',
        text: '客服电话',
        tip: '1380043433',
      }, {
        icon: 'images/feedback.png',
        text: '意见反馈',
        tip: '',
        cut: true,
        url: '../feedback/feedback'
      }, {
        icon: 'images/about.png',
        text: '关于商城',
        tip: '',
        url: '../about/about'
      }
    ]
  },
  
  onShow(){
    var that = this;
     app.getUserInfo(function (userInfo) {
       //更新数据
       that.setData({
         userInfo: userInfo
       })
    })
    wx.request({
      url: API.APIDomian + 'paidNum',
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {

        that.data.orderCell[0].count = res.data.unpaid;
        that.data.orderCell[1].count = res.data.undelivered;
        that.data.orderCell[2].count = res.data.unreceived;
        that.setData({
          orderCell: that.data.orderCell
        });
      },
      fail: function () {
        API.failTips('订单信息获取失败，请重试')
      }
    })
  },
  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },

  // 点击进入
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    if (e.currentTarget.dataset.urlType) {
      wx.navigateTo({
        url: 'user-info/user-info'
      });
    } else {
      if (url === undefined) {
        wx.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.tip
        });
      } else {
        wx.navigateTo({
          url
        });
      }
    }
  }
});
