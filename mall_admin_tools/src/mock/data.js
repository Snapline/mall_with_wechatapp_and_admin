import Mock from 'mockjs';

var Random = Mock.Random;

Random.date('yyyy-MM-dd');

export default Mock.mock('/goodsInfo', {
	'goodsInfo|1-10':[{
		  'goodsName|1':['手串','佛牌','弥勒佛核雕','爱疯四顿饭'],
          'category|1': ['弥勒','金刚','达摩','阿尔萨斯'],
          'price': '@integer(1, 200)',
          'id|1-10': 1
	}]
});

Mock.mock('/cateInfo', {
	'cateInfo|5-10':[{
		  'category|1': ['弥勒','金刚','达摩','阿尔萨斯','奥莉尔','雷加尔','纳兹波'],
          'id|1-10': 1
	}]
});

Mock.mock('/orderInfo', {
	'orderInfo|1-10':[{
		  'buyer|1':['周杰伦','林俊杰','孙燕姿','王力宏'],
		  'orderId': '58fd7d7fd7s87f87f8',
          'address': '苏州市工业园区',
          'status': ['待付款','待发货','已发货','已确认',''],
          'price': '@integer(1, 200)',
          'date': '2017-09-08',
          'id|1-10': 1
	}]
});
