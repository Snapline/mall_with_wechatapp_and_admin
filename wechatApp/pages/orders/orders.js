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
  onLoad(options) {
    const that = this;
    //区别nav上的订单类型，暂时不显示
    // if (options.t) {
    //   this.setData({
    //     activeNav: options.t
    //   });
    // }
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
        res.data.result.data.forEach(function(item){
          item.apiHeader = API.APIDomian
        });
        that.setData({
          orderList: res.data.result.data
        })
      },
      fail: function () {
        API.failTips('获取订单信息失败，请重新请求')
      }
    })

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

  cancelOrder(e) {
    const that = this;
    console.log(that)
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
    content: '你是否需要取消订单',
    showCancel: true,
    success: (res) => {
       if(res.confirm == 0) {
          return;
        }
        resource.cancalOrder(orderSn).then((res) => {
           if (res.statusCode === 200 ) {
              this.data.orderList.forEach((item,key) => {
              if(item.order_sn == orderSn && that.data.activeNav != "all") {
                  this.data.orderList.splice(key, 1);
              } else {
                 item.order_status = '订单取消';
              }
             })
              resource.showTips(that, '订单取消成功');
              this.setData({orderList :this.setOrderData(this.data.orderList)});

           } else {
              resource.showTips(that, '订单取消失败');
           }
        });
      }
    });
  },

   confirmOrder(e) {
    const that = this;
    console.log(that)
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
    content: '确定收货',
    showCancel: true,
    success: (res) => {
       if(res.confirm == 0) {
          return;
        }
        resource.confirmOrder(orderSn).then((res) => {
           if (res.statusCode === 200 ) {
              this.data.orderList.forEach((item,key) => {
              if(item.order_sn == orderSn && that.data.activeNav != "all") {
                  this.data.orderList.splice(key, 1);
              } else {
                 item.order_status = '交易成功';
              }
             })
              resource.showTips(that, '确认收货成功');
              this.setData({orderList :this.setOrderData(this.data.orderList)});

           } else {
              resource.showTips(that, '确认收货失败');
           }
        });
      }
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

  }
});
