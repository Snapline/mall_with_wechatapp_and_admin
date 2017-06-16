var express = require('express');
var app = express();
var data = require('./data.json')


app.get('/bannerdata', function (req, res) {
   res.json( data.bannerData );
})

app.get('/featuredata', function (req, res) {
   res.json( data.newGoodsData );
})

//分类
app.get('/catedata', function (req, res) {
   res.json( data.cateData );
})

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//个人信息
app.get('/paidNum', function (req, res) {
  res.send(data.paidNum);
});

//购物车信息
app.get('/cartInfo', function (req, res) {
  res.send(data.cartList);
});

//具体宝贝信息
app.get('/productInfo', function (req, res) {
  res.send(data.productInfo);
});


var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});