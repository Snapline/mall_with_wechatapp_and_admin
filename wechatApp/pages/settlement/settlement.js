import Promise from '../../lib/promiseEs6Fix';
import request from '../../lib/request';
import resource from '../../lib/resource';
var API = require('../../request/API.js');
const app = getApp();
Page({
  data: {
    address: [], //地址
    buyItemId: '', //购买商品的id字符串
    buyNumStr: '', //购买商品的数量字符串
    provinceChosen: '', //默认地址的省份
    freight: 0, //运费
    totalPay: 0, //商品总额
    ok: 1,
    loading: false,
    exec:false,
  },

  onLoad(option) {
    console.log(option)
    this.setData({
      buyItemId: option.itemId,
      buyNumStr: option.itemNum,
      totalPay: option.totalPrice
    })
  },

  onShow(){
    var that = this;
    //获取默认地址
    wx.request({
      url: API.APIDomian + '/wx/address/query',
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': app.globalData.sessionId
      },
      success: function (res) {
        that.setData({
          address:res.data.data,
          provinceChosen: res.data.data.province
        })


        //获取运费价格
        wx.request({
          url: API.APIDomian + '/wx/address/express_price',
          data: {
            'item_id': that.data.buyItemId,
            'num': that.data.buyNumStr,
            'province': that.data.provinceChosen
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Cookie': app.globalData.sessionId
          },
          success: function (res) {
            that.setData({
              freight: res.data.express_price
            })
          },
          fail: function () {
            API.failTips('运费获取失败，请重新请求')
          }
        })
      },
      fail: function () {
        API.failTips('地址请求错误，请重新请求')
      }
    })

  },
  postOrder() {
    var that = this;
      wx.request({
        url: API.APIDomian + '/wx/item/order',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'Cookie': app.globalData.sessionId
        },
        method: 'POST',
        data: {
          'item_id': that.data.buyItemId,
          'num': that.data.buyNumStr,
          'coupon_id' :'',
          'points': 0,
          'user_name': that.data.address.user_name,
          'phone': that.data.address.phone,
          'province': that.data.provinceChosen,
          'address': that.data.address.address
        },
        success: function (resItemData) {
          console.log(resItemData);
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

  navigateToAddress() {
    //加入choose=1的标志，有此标志，说明用户可以选择地址。
    wx.navigateTo({
      url: '../addresses/addresses?choose=1',
    });
  }
});


// function submitCharge(that) {
//   wx.request({
//     url: API.DOMAIN + 'order/game_prepay',
//     header: {
//       'content-type': 'application/x-www-form-urlencoded',
//       'Cookie': that.data.userSession
//     },
//     method: 'POST',
//     data: {
//       gameId: that.data.gameId,
//       itemId: that.data.chosenBox,
//       account: that.data.account,
//       cardNum: that.data.buyNumber,
//       price: that.data.unitPrice,
//       totalPrice: that.data.amountPay,
//       gameArea: that.data.gameRegion.selectedRegion || '',
//       gameSrv: that.data.gameRegion.selectedServer || ''
//     },
//     success: function (resItemData) {
//       console.log(resItemData);
//       if (resItemData.data.resp_code == '000000') {
//         //成功获取，进入充值步骤
//         var paymentData = resItemData.data.data;
//         wx.requestPayment({
//           'timeStamp': paymentData.timeStamp,
//           'nonceStr': paymentData.nonceStr,
//           'package': paymentData.package,
//           'signType': 'MD5',
//           'paySign': paymentData.paySign,
//           'success': function (res) {
//           },
//           'fail': function (res) {
//             wx.showModal({
//               content: '订单未支付成功，请重新支付。',
//               showCancel: false
//             })
//           }
//         })
//       }
//       else {
//         //获取支付信息失败
//         showModal('网络请求错误，请重新操作');
//       }
//     },
//     fail: function () {
//       showModal('网络请求错误，请重新操作');
//     }
//   })
// }