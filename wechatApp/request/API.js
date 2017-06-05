//var API = 'http://192.168.1.105:3000/';
//公司
var API = 'http://10.0.61.37:3000/'; 

var showModal = function(content) {
  wx.showModal({
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {

      }
    }
  })
}

module.exports = {
  APIDomian: API,
  failTips: showModal
}