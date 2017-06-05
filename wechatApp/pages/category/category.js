// import request from '../../lib/request';
// import serviceData from '../../data/config';

// Page({
//   data: {
//     categories: []
//   },
//   navigateToCategoryProduct(event) {
//     var categoryId = event.currentTarget.dataset.cateId;
//     wx.navigateTo({
//       url: '../category-product/category-product?id=' + categoryId,
//     })
//   },
//   onLoad() {
//       this.setData({ categories: serviceData.cateData});
//   }
// });

var API = require('../../request/API.js');
Page({
  data: {
    category: [
      { name: '弥勒', id: 'm1' },
      { name: '达摩', id: 'm2' },
      { name: '金刚', id: 'm3' }
    ],
    detail: [],
    curIndex: 0,
    toView: '1'
  },
  onReady() {
    var self = this;
    wx.request({
      url: API.APIDomian + 'catedata',
      success(res) {
        console.log(res.data)
        self.setData({
          detail: res.data
        })
      }
    });

  },
  switchTab(e) {
    this.setData({
      toView: e.target.dataset.id,
      curIndex: e.target.dataset.index
    })
  }

})