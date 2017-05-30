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


Page({
  data: {
    category: [
      { name: '果味', id: 'guowei' },
      { name: '蔬菜', id: 'shucai' },
      { name: '炒货', id: 'chaohuo' },
      { name: '点心', id: 'dianxin' },
      { name: '粗茶', id: 'cucha' },
      { name: '淡饭', id: 'danfan' }
    ],
    detail: [],
    curIndex: 0,
    isScroll: false,
    toView: 'guowei'
  },
  onReady() {
    var self = this;
    wx.request({
      url: 'http://www.gdfengshuo.com/api/wx/cate-detail.txt',
      success(res) {
        console.log(res.data)
        self.setData({
          detail: res.data.result
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