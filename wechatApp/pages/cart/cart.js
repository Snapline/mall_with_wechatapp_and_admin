var app = getApp();
import resource from '../../lib/resource';
var API = require('../../request/API.js');
var API = require('../../request/API.js');
Page({
  data: {
    loading: true,
    cartList: [],
    bottomNum: 1,
    totalNumber: 0, //一共有多少件商品
    totalPrice: 0, //总价
    checkedStatus: true, //全选
    buyNumber: 0,
    buyPrice: 0,
    apiHeader: API.APIDomian
  },
  onShow() {
    const that = this;
    //获取购物车信息
    getCartInfo(that)
  },
  // 选择商品
  selectProduct(event) {
    var cartId = event.currentTarget.dataset.id;
    var checkedStatus = event.currentTarget.dataset.checkedStatus;
    var totalNumber = 0;
    var totalPrice = 0;
    var buyNumber = 0;
    var buyPrice = 0;
    var id = [];
    checkedStatus = checkedStatus === true;
    var changeStatus = true;
    this.data.cartList.forEach(item => {
      if (item.id == cartId || cartId == 0) {
        if (item.status != !checkedStatus) {
          id.push(item.id);
        }
        item.status = cartId == 0 ? !checkedStatus : !item.status;

      }
      if (!item.status) {
        changeStatus = false;
      } else {
        buyNumber += item.num;
        buyPrice += item.num * item.price;
      }
      totalNumber += item.num;
      totalPrice += item.num * item.price;
    });
    changeStatus = cartId == 0 ? !checkedStatus : changeStatus;
    this.setData({
      cartList: this.data.cartList,
      checkedStatus: changeStatus,
      totalNumber: totalNumber,
      totalPrice: totalPrice.toFixed(2),
      buyNumber: buyNumber,
      buyPrice: buyPrice.toFixed(2)
    });
  },

  // 改变商品数量
  changeNumber(event) {
    var cartId = event.currentTarget.dataset.id;
    var optType = event.currentTarget.dataset.type;
    var totalNumber = 0;
    var totalPrice = 0;
    var buyNumber = 0;
    var buyPrice = 0;

    this.data.cartList.forEach(item => {
      if (item.id == cartId) {
        if (optType == 'plus') {
          if (item.kc == item.num) {
            this.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '该宝贝不能购买更多哦'
              }
            });
            setTimeout(() => {
              this.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                }
              });
            }, 2000);
          } else {
            item.num++;
          }

        } else {

          if (item.num <= 1) {
            this.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '亲，不能再减少了哦'
              }
            });
            setTimeout(() => {
              this.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                }
              });
            }, 2000);
          } else {
            item.num--;
          }
        }
        if (item.num == item.kc) {
          item.plus_class = "disabled";
        } else {
          item.plus_class = "";
        }
        if (item.num == 1) {
          item.decr_class = "disabled";
        } else {
          item.decr_class = "";
        }
      }
      if (!item.status) {

      } else {
        buyNumber += item.num;
        buyPrice += item.num * item.price;
      }
      totalNumber += item.num;
      totalPrice += item.num * item.price;
    });
    this.setData({
      cartList: this.data.cartList,
      totalNumber: totalNumber,
      totalPrice: totalPrice.toFixed(2),
      buyNumber: buyNumber,
      buyPrice: buyPrice.toFixed(2)
    });
  },
  // 去结算页面
  toSettlement() {
    if(this.data.buyNumber == 0) {
       resource.showTips(this, '你还未勾选商品'); return;
    }
    wx.navigateTo({
      url: '../settlement/settlement',
    });
  },
  // 去除购物车物品
  delProduct(event) {
    const productId = event.currentTarget.dataset.id;
    var that = this;
    wx.showModal({
      content: '你确定在购物车中删除该商品',
      showCancel: true,
      success: (res) => {
        if(res.confirm == 0) {
          return;
        }

        wx.request({
          url: API.APIDomian + '/wx/shopcart/delete',
          data: {
            'id': productId
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Cookie': app.globalData.sessionId
          },
          success: function (res) {
            getCartInfo(that)
          },
          fail: function () {
            API.failTips('购物车信息请求错误，请重新请求')
          }
        })

      }
    });
  },
  navigateTo() {
    wx.switchTab({
      url: '../home/home'
    });
  }
});

//获取购物车信息
function getCartInfo(that){
  wx.request({
    url: API.APIDomian + '/wx/shopcart/query',
    data: {
      'page_num': that.data.bottomNum,
      'per_page': 10
    },
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Cookie': app.globalData.sessionId
    },
    success: function (res) {
      var totalNumber = 0;
      var totalPrice = 0;
      var buyNumber = 0;
      var buyPrice = 0;
      res.data.data.result.forEach(item => {
        console.log(item)
        // 保留两位小数点
        item.real_price = item.price.toFixed(2);
        item.status = true;
        buyNumber += item.num;

        buyPrice += item.num * item.price;
        totalNumber += item.num;
        totalPrice += item.num * item.price;
        if (item.num == item.kc) {
          item.plus_class = "disabled";
        } else {
          item.plus_class = "";
        }
        if (item.num == 1) {
          item.decr_class = "disabled";
        } else {
          item.decr_class = "";
        }
      })
      that.setData({
        cartList: res.data.data.result,
        loading: false,
        totalNumber: totalNumber,
        totalPrice: totalPrice.toFixed(2),
        buyNumber: buyNumber,
        buyPrice: buyPrice.toFixed(2)
      });


    },
    fail: function () {
      API.failTips('购物车信息请求错误，请重新请求')
    }
  })
}