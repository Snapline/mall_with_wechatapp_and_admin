import resource from '../../lib/resource';
import city from '../../lib/city';
import tips from '../../lib/tips';
var app = getApp();
var API = require('../../request/API.js');

Page({
  data: {
    loading: true,
    name: '',
    phone: '',
    county: '',
    address: '',
    addressid: '',
    items: {
      labelText: '设置为默认',
      iconType: 'circle',
      is_default: false
    },
    index: 0,
    tipsData: {
      title: '',
      isHidden: true
    }
  },
  setDefault() {
    const isDefault = this.data.items.is_default;
    const iconColor = !this.data.items.is_default ? 'orange' : '';

    this.setData({
      items: {
        labelText: '设置为默认',
        iconType: !isDefault ? 'success' : 'circle',
        is_default: !isDefault,
        iconColor
      }
    });
  },
  onLoad(options) {
    this.setData({ addressid: options.id });
    var that = this;
 
    if (options.id) {
      wx.request({
        url: API.APIDomian + '/wx/address/query_by_id',
        data: {
          'id': options.id
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'Cookie': app.globalData.sessionId
        },
        success: function (res) {
          that.data.items.is_default = res.data.data[0].is_default;
          that.setData({
            name: res.data.data[0].user_name,
            phone: res.data.data[0].phone,
            county: res.data.data[0].details.split(',')[2],
            province: res.data.data[0].details.split(',')[0],
            city: res.data.data[0].details.split(',')[1],
            street: res.data.data[0].street,
            loading: false
          });
          //this.setDefault();
          city.init(that);
        },
        fail: function () {
          API.failTips('获取地址失败，请重新请求')
        }
      })

      // resource.fetchDetailAddress(options.id).then((res) => {
      //   this.data.items.is_default = res.data.is_default;
      //   this.setData({
      //     consignee: res.data.consignee,
      //     mobile: res.data.mobile,
      //     county: res.data.county,
      //     province: res.data.province,
      //     city: res.data.city,
      //     address: res.data.address,
      //     loading: false,
      //     items: this.data.items
      //   });
      //   //this.setDefault();
      //     city.init(that);
      // });
    } else {
        city.init(that);
    }
     
  },
  listenerReciverInput(e) {
    this.data.name = e.detail.value;
  },
  listenerPhoneInput(e) {
    this.data.phone = e.detail.value;
  },
  listenerAddressInput(e) {
    this.data.address = e.detail.value;
  },
  showToast(title, duartion) {
    const that = this;
    const tipsData = {
      title: title || '',
      duartion: duartion || 2000,
      isHidden: false
    };
    tips.toast(that.data.tipsData);
    that.setData({
      tipsData
    });
    setTimeout(() => {
      tipsData.isHidden = true;
      that.setData({
        tipsData
      });
    }, tipsData.duartion);
  },
  submitBtn() {
    const that = this;
    if (!this.data.name) { that.showToast('收货人不能为空'); return; }
    if (this.data.name.length < 2) { that.showToast('收货人姓名限制为2~15个字符'); return; }
    if (!this.data.phone) { that.showToast('手机号不能为空'); return; }
    if (!/^1[3|4|5|7|8]\d{9}$/.test(this.data.phone)) { that.showToast('手机格式有误，请重新输入'); return; }
    if (this.data.addressSelect.provinceIndex == 0) { that.showToast('省市地址不能为空'); return; }
    if (!this.data.address) { that.showToast('街道地址不能为空'); return; }
    if (this.data.address.length < 5) { that.showToast('街道地址字数必须在5~60之间'); return; }

    // console.log(this.data.city);
    // const data = {
    //   consignee: this.data.consignee,
    //   province: this.data.addressSelect.provinceIdx[this.data.addressSelect.provinceIndex],
    //   city: this.data.addressSelect.cityIdx[this.data.addressSelect.provinceIndex][this.data.addressSelect.cityIndex],
    //   county: this.data.addressSelect.districtIdx[this.data.addressSelect.cityIdx[this.data.addressSelect.provinceIndex][this.data.addressSelect.cityIndex]][this.data.addressSelect.districtIndex],
    //   address: this.data.address,
    //   mobile: this.data.mobile,
    //   is_default: this.data.items.is_default ? 1 : 0
    // };

     var pvcCityArr = [];
     pvcCityArr.push(this.data.addressSelect.provinceIdx[this.data.addressSelect.provinceIndex]);
     pvcCityArr.push(this.data.addressSelect.cityIdx[this.data.addressSelect.provinceIndex][this.data.addressSelect.cityIndex]);
     pvcCityArr.push(this.data.addressSelect.districtIdx[this.data.addressSelect.cityIdx[this.data.addressSelect.provinceIndex][this.data.addressSelect.cityIndex]][this.data.addressSelect.districtIndex])

    wx.request({
      url: API.APIDomian + '/wx/address/add',
      data: {
        'name': this.data.name,
        'phone': this.data.phone,
        'province': this.data.addressSelect.selectedProvince,
        'city': this.data.addressSelect.selectedCity,
        'county': this.data.addressSelect.selectedDistrct,
        'street': this.data.address,
        'details': pvcCityArr,
        'is_default': this.data.items.is_default ? 0 : 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': app.globalData.sessionId
      },
      success: function (res) {
        if(res.data.resp_code=='000000'){
          wx.navigateTo({
            url: '../addresses/addresses'
          });
        }
        else{
          API.failTips('收货地址添加失败，请重试')
        }

      },
      fail: function () {
        API.failTips('收货地址添加失败，请重试')
      }
    })

  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    });
  }
});
