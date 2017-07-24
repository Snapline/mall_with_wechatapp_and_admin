import request from '../../lib/request';
import resource from '../../lib/resource';

const app = getApp();
Page({
  data: {
    loading: true,
    order:{},
    address:{}
  },
  onLoad(options) {
    var addressObj = {
      'consignee': options.username,
       'mobile':options.phone,
       'detail_address': options.address
    }

    var orderObj = {
      'order_amount': options.totalprice,
      'shipping_price': options.freight,
      'order_sn': options.orderid,
      'created_at': options.timebegin
    }
    this.setData({
      address: addressObj,
      order: orderObj
    })
  }
});
