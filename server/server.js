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

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});