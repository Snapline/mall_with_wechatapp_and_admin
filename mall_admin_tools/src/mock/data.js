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
	'cateInfo|1-10':[{
		  'category|1': ['弥勒','金刚','达摩','阿尔萨斯'],
          'id|1-10': 1
	}]
});

Mock.mock('/supplyInfo', {
	'supplyInfo|5-10':[{
		  'theway|1':['欧飞','赛博', '易赛'],
          'company':'南京欧飞数卡公司',
          'id|1-10': 1
	}]
});

Mock.mock('/supplier/findByKeyword', {
	'supplyInfo|1-10':[{
		  'theway|1':['欧飞','赛博'],
          'company':'南京欧飞数卡公司',
          'id|1-10': 1
	}]
});

Mock.mock('/affairsInfo', {
	'supplyInfo|1-10':[{
		  'doneTime': '@date("yyyy-MM-dd")',
          'affairs|1':['欧飞加油卡请款','XXX话费卡请款', '欧飞线下卡售出', '欧飞加油卡打款'],
          'host|1': ['刘文杰','周杰伦','孙燕姿'],
          'status|1':['未审核','驳回','确认','未打款'],
          'id|1-10': 1
	}]
});

Mock.mock('/salesInfo', {
	'salesInfo|5':[{
		  'threedays': '@integer(10000, 100000)',
          'twodays': '@integer(10000, 100000)',
          'oneday': '@integer(10000, 100000)',
          'consumption': '@integer(10000, 100000)',
	}]
});

Mock.mock('/card', {
	'cardInfo|5':[{
		  'offline': '@integer(10000, 100000)',
          'online': '@integer(10000, 100000)',
          'process': '@integer(10000, 100000)',
          'intotal': '@integer(10000, 100000)',
	}]
});
