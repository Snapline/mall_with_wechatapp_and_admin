import resource from '../../lib/resource';
import tips from '../../lib/tips';
var app = getApp();
var API = require('../../request/API.js');

Page({
  data: {
    // 设置菊花初始状态
    loading: true,
    addressesList: [],
    defaultId: 0,
    tipsData: {
      title: ''
    }
  },

  addAddress(e){
    wx.navigateTo({
      url: '../address-edit/address-edit'
    });
  },

  // 设置默认地址
  setDefaultStyle(list, id) {
    list.forEach((itm) => {
      if (itm) {
        itm.items.is_default = +itm.id === id;
        itm.items.iconType = itm.items.is_default ? 'success' : 'circle';
        itm.items.iconColor = itm.items.iconType === 'success' ? 'orange' : '';
      }
    });
  },
  //编辑地址
  goEdit(event) {
    const id = event.target.dataset.addressId;
    wx.navigateTo({
      url: '../address-edit/address-edit?id='+id
    });
  },

  //删除地址
  delete(event) {
    const id = event.target.dataset.addressId;
    let addressList = this.data.addressesList;
    const that = this;

    resource.confirmToast(() => {
      wx.request({
        url: API.APIDomian + '/wx/address/delete',
        data: {
          'id': id
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'Cookie': app.globalData.sessionId
        },
        success: function (res) {
          if (res.data.resp_code == '000000') {
            queryAddress(that)
          }
          else {
            wx.failToast();
          }
        },
        fail: function () {
          API.failTips('地址信息请求错误，请重新请求')
        }
      })


      // resource.deleteAddress(id).then((res) => {
      //   if (res.statusCode === 200) {
      //     resource.successToast(() => {
      //       const defaultData = addressList.find(itm => itm.items.is_default === true);
      //       if (+defaultData.address_id === +id && addressList.length > 0) {
      //         addressList = addressList.filter(itm => +itm.address_id !== +id);
      //         // addressList.forEach((itm) => {

      //         // });
      //         // addressList[0].items.is_default = true;
      //         // addressList[0].items.iconType = 'success';
      //         // addressList[0].items.iconColor = '#FF2D4B';
      //       }
      //       this.setData({
      //         defaultId: defaultData.address_id,
      //         addressesList: addressList.filter(itm => +itm.address_id !== +id)
      //       });
      //     });
      //   }
      // });
    });
  },

  //地址设置为默认
  setDefault(event) {
    const checkedId = +event.currentTarget.dataset.valueId || +event.detail.value;
    let setFlag = false;
    const that = this;
    resource.loadingToast();
    wx.request({
      url: API.APIDomian + '/wx/address/modify',
      data: {
        'is_default':0,
        'id': checkedId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': app.globalData.sessionId
      },
      success: function (res) {
        if(res.data.resp_code=='000000'){
          setFlag = true;
          that.setDefaultStyle(that.data.addressesList, checkedId);
          that.setData({ addressesList: that.data.addressesList });

          wx.showToast({
          title: '默认地址设置成功',
           icon: 'success'
         });
        }
        else{
          wx.failToast();
        }
      },
      fail: function () {
        API.failTips('地址信息请求错误，请重新请求')
      }
    })

 
  },

  onShow() {
    tips.toast(this.data.tipsData);
    const tipsData = {
      title: 'sku不足zz',
      duration: 2000,
      isHidden: false
    };
    this.setData({
      tipsData
    });
    setTimeout(() => {
      tipsData.isHidden = true;
      this.setData({
        tipsData
      });
    }, 3000);

    var that = this;
    queryAddress(that)

  }
});

function queryAddress(that){
  wx.request({
    url: API.APIDomian + '/wx/address/query_all',
    data: {},
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Cookie': app.globalData.sessionId
    },
    success: function (res) {
      if (res.data.data) {
        res.data.data.forEach((itm) => {
          itm.overlayConfirm = false;
          itm.items = {
            id: itm.id,
            is_default: itm.is_default,
            isgroup: true,
            labelText: '设置为默认',
            iconType: itm.is_default ? 'circle' : 'success'
          };
          itm.items.iconColor = itm.items.iconType === 'success' ? 'orange' : '';
        });
        console.log(res);
        that.setData({
          addressesList: res.data.data,
          loading: false
        });
      } else {
        that.setData({
          addressesList: [],
          loading: false
        });
      }
    },
    fail: function () {
      API.failTips('地址信息请求错误，请重新请求')
    }
  })
}
