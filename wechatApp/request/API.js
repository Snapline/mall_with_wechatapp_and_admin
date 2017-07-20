//var API = 'http://49.64.69.62:9090';
//公司
var API = 'http://10.0.32.34:9090'; 

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