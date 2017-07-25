import request from '../../lib/request';
import resource from '../../lib/resource';
import serviceData from '../../data/config';
import Promise from '../../lib/promiseEs6Fix';
var API = require('../../request/API.js');

const app = getApp();
Page({
  data: {
    loading: false,
    bottomNum: 1,
    hasToEnd: false,
    apiHeader: '',

    activeNav: 'all',
    navs: [{
      text: '全部',
      alias: 'all'
    }, {
      text: '待付款',
      alias: 'unpaid'
    }, {
      text: '待发货',
      alias: 'undelivered'
    }, {
      text: '待收货',
      alias: 'unreceived'
    }],
    orderList: []
  },
  onShow() {
    const that = this;
    //区别nav上的订单类型，暂时不显示
    // if (options.t) {
    //   this.setData({
    //     activeNav: options.t
    //   });
    // }
    that.setData({
      orderList:[]
    })
    orderquery(that);

  },

  // 上拉加载
  onReachBottom: function () {
    if (!this.data.hasToEnd) {
      var tempCount = this.data.bottomNum;
      this.setData({
        bottomNum: tempCount + 1
      });
      orderquery(this)
    }
    else {
      API.failTips('已经到底啦！')
    }

  },

  //导航栏切换类别
  // changeList(e) {
  //   const that = this;
  //   const alias = e.target.dataset.alias;

  //   if (alias !== this.data.activeNav) {
  //     this.setData({
  //       activeNav: e.target.dataset.alias,
  //       loading: true
  //     });
  //     this.getList().then((res) => {
  //       that.setOrderData(res.data);
  //       that.setData({
  //         orderList: res.data,
  //         loading: false
  //       });
  //     });
  //   }
  // },

  //确认收货
  confirmGoods(e){
    const orderid = e.currentTarget.dataset.orderid;
    const that = this;
    wx.showModal({
      title: '确认收货',
      content: '是否确认收货？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: API.APIDomian + '/wx/order/confirm',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
              'Cookie': app.globalData.sessionId
            },
            method: 'POST',
            data: {
              'orderId': orderid
            },
            success: function (resItemData) {
              if (resItemData.data.resp_code == '000000') {
                    wx.showModal({
                      content: '已成功确认收货',
                      showCancel: false
                    })
                    that.setData({
                      bottomNum: 1,
                      hasToEnd: false,
                      orderList:[]
                    })
                    orderquery(that);
              }
              else {
                API.failTips('网络请求错误，请重新操作');
              }
            },
            fail: function () {
              API.failTips('网络请求错误，请重新操作');
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },

  //评价
  commentGoods(e){
    const orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../review/review?orderid=' + orderid
    });
  },

  //继续付款
  payOrder(e) {
    var orderId = e.currentTarget.dataset.orderid;
    const that = this;
    wx.request({
      url: API.APIDomian + '/wx/item/repay',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': app.globalData.sessionId
      },
      method: 'POST',
      data: {
        'orderId': orderId
      },
      success: function (resItemData) {
        if (resItemData.data.resp_code == '000000') {
          //成功获取，进入充值步骤
          var paymentData = resItemData.data.data;
          wx.requestPayment({
            'timeStamp': paymentData.timeStamp,
            'nonceStr': paymentData.nonceStr,
            'package': paymentData.package,
            'signType': 'MD5',
            'paySign': paymentData.paySign,
            'success': function (res) {
              API.failTips('支付成功');
            },
            'fail': function (res) {
              wx.showModal({
                content: '订单未支付成功，请重新支付。',
                showCancel: false
              })
            }
          })
        }
        else {
          //获取支付信息失败
          API.failTips('网络请求错误，请重新操作');
        }
      },
      fail: function () {
        API.failTips('网络请求错误，请重新操作');
      }
    })

  },

  //查看详情
  showDetails(e){
    const phone = e.currentTarget.dataset.phone;
    const timebegin = e.currentTarget.dataset.timebegin;
    const username = e.currentTarget.dataset.username;
    const totalprice = e.currentTarget.dataset.totalprice;
    const freight = e.currentTarget.dataset.freight;
    const address = e.currentTarget.dataset.address;
    const orderid = e.currentTarget.dataset.orderid;
    const statusText = e.currentTarget.dataset.statusdes;
    wx.navigateTo({
      url: '../order-detail/order-detail?phone=' + phone + '&timebegin=' + timebegin + '&username=' + username + '&totalprice=' + totalprice + '&freight=' + freight + '&address=' + address + '&orderid=' + orderid + '&status=' + statusText    });
  },

  //查看物流
  checkDeliver(e){
    const orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../deliver-detail/deliver-detail?orderid=' + orderid
    });
  }
});

function orderquery(that){
  wx.request({
    url: API.APIDomian + '/wx/order/query',
    data: {
      'perPage': 5,
      'pageNum': that.data.bottomNum
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Cookie': app.globalData.sessionId
    },
    success: function (res) {
      // res.data.result.data.forEach(function (item) {
      //   item.apiHeader = API.APIDomian
      // });
      // that.setData({
      //   orderList: res.data.result.data
      // })


      var resJson = res.data.result.data;
      var previousOrderData = that.data.orderList;
      for (var i = 0; i < resJson.length; i++) {
        resJson[i].apiHeader = API.APIDomian
        previousOrderData.push(resJson[i])
      }

      that.setData({
        orderList: previousOrderData
      })

      if (that.data.bottomNum == res.data.result.total_page) {
        that.setData({
          hasToEnd: true
        })
      }
    },
    fail: function () {
      API.failTips('获取订单信息失败，请重新请求')
    }
  })
}