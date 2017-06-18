<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/goodslist' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>修改商品</el-breadcrumb-item>
		</el-breadcrumb>
		<!--新建栏-->
		<el-row style="margin-bottom:30px; margin-top:30px;">
		  <el-col :span="24">
		  	<div class="grid-content bg-purple-dark">
		  	修改商品
		  	<el-button class="newBtn" type="info" @click="createUser">返回商品列表</el-button>
		  	</div>
		  </el-col>
		</el-row>
		
		<!--表单-->
		<el-form :model="newGoodsForm" ref="newGoodsForm" :rule="formRule" label-width="150px" class="new_user_form">
				
			  <el-form-item
			    label="标题"
			    prop="name"
			    :rules="{ required: true, message: '必须填入宝贝标题', trigger: 'blur' }"
			  >
			    <el-input type="text" v-model="newGoodsForm.name" auto-complete="off"></el-input>
			  </el-form-item>
			  
			  <el-form-item
			    label="简洁描述"
			    prop="description"
			  >
			    <el-input type="textarea" v-model="newGoodsForm.description" auto-complete="off"></el-input>
			  </el-form-item>
			  
			  <el-form-item
			    label="分类"
			    prop="category_id"
			  >
			  	   	<el-radio-group v-model="newGoodsForm.category_id" v-for="item in cateList">
				    	<div style="display:inline-block;">
				    		<el-radio :label="item.id" style="margin-right:20px">{{item.category}}</el-radio>
				    	</div>
				    
					</el-radio-group>
			  </el-form-item>
			  
				<el-form-item
				    label="价格"
				    prop="price"
				    :rules="checkFloatRules"
				>
				   <el-input type="text" v-model="newGoodsForm.price" auto-complete="off"></el-input>
				</el-form-item>
				
				<el-form-item
				    label="库存量"
				    prop="num"
				    :rules="checkIntRules"
				>
				   <el-input type="text" v-model="newGoodsForm.num" auto-complete="off"></el-input>
				</el-form-item>
				
				<el-form-item
				    label="已售数量"
				    prop="sales_num"
				>
				   <el-input type="text" placeholder="注意数量不要超过库存量哦" v-model="newGoodsForm.sales_num" auto-complete="off"></el-input>
				</el-form-item>
				
				<el-form-item
				    label="好评率"
				    prop="comment"
				>
				   <el-input type="text" placeholder="如想要99%好评率就填入99，不要超100" v-model="newGoodsForm.comment" auto-complete="off"></el-input>%
				</el-form-item>
				
				<el-form-item
				    label="是否推荐首页"
				    prop="recommend"
				>
				   <el-radio-group v-model="newGoodsForm.recommend">
				    <el-radio :label="0">是</el-radio>
				    <el-radio :label="1">否</el-radio>
				  </el-radio-group>
				</el-form-item>
				
				<el-form-item
				    label="产品主图"
				    prop="pics"
				  >
				   <img :src="theme_pic" />
				</el-form-item>
				
				<el-form-item
				    label="更换产品主图"
				    prop="pics"
				  >
				    <!--<el-upload
					  ref="goodsPic"
					  class="upload_area"
					  :action="newUrl"
					  name="goodspic"
					  method="put"
					  :on-success="goodsPicsSuc">
					  <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
					</el-upload>-->
					
					<dropzone ref="theme_dropzone" id="themeSuccess" method="put" auto-process-queue="true" :url="newUrl" v-on:vdropzone-success="themeSuccess">
					 </dropzone>
				</el-form-item>
				
				<el-form-item
				    label="产品轮播图"
				    prop="pics"
				   style="width:900px;"
				  >
				  <div class="swipe" v-for="item in swipePics">
				  	<i class="el-icon-close" style="position:absolute;" @click="deleteSwipe(item.id)"></i>
				  	 <img :src="item.swipe_pic_url_resize" />
				  </div>
				  
				</el-form-item>
				
				<el-form-item
				    label="产品详情描述图"
				    prop="pics"
				  >
				  <img :src="descPicUrl" />
				</el-form-item>
				
			  <el-form-item>
			    <el-button type="primary" @click="submitForm('newGoodsForm')">提交</el-button>
			    <!--<el-button @click="clearForm">取消</el-button>-->
			  </el-form-item>
			</el-form>
	</div>
</template>

<script>
	import dropzone from '../general/catedropzone.vue'
	import multidrop from '../general/multidropzone.vue'
	import API from '../request/api.js'
	export default {
	    data() {
	    	var checkEmptyString = (rule, value, callback) => {
	    		if(!value){
	    			callback(new Error('不得为空'));
	    		}
	    		else{
	    			callback()
	    		}
	    	}; 
	    	
	    	var checkIntNumber = (rule, value, callback) => {
	    		if(!value){
	    			callback(new Error('不得为空'));
	    		}
	    		else if (!/^[0-9]*[0-9][1-9]*$/.test(value)){
	        		callback(new Error('只能填入整数'));
	        	}
	        	else{
	        		callback()
	        	}
	    	};
	    	
	    	var checkFloatNumber = (rule, value, callback) => {
	    		if(!value){
	    			callback(new Error('不得为空'));
	    		}
	    		else if (!/^\d+(.\d+)?$/.test(value)){
	        		callback(new Error('只能输入整数或小数'));
	        	}
	        	else{
	        		callback()
	        	}
	    	};
	    	
    	 	const generateData = _ => {
	        return API.APIDomain;
	      };
	    	return {	
	        	//表单数据
	        	newGoodsForm:{
	        		'name':'',
	        		'description':'',
	        		'category_id':0,
	        		'price': '',
	        		'num':'',
	        		'sales_num':'',
	        		'comment':'',
	        		'recommend':1
	        	},
	        	cateList:[],
	        	theme_pic:'',
	        	swipePics: [],
	        	//之后的文件传输地址
	        	newId:0,
	        	 	apiHead: generateData(),
	        	 	goodsId: 0,
		        //表单校验规则
		        //填空校验
		        checkEmptyRules:[
		        	{validator: checkEmptyString, trigger: 'blur'}
		        ],
		        //整数校验
				checkIntRules:[
		        	{validator: checkIntNumber, trigger: 'blur'}
		        ],
		        //浮点数校验
		        checkFloatRules:[
		        	{validator: checkFloatNumber, trigger: 'blur'}
		        ]
	      	};
	    },
	    created(){
	    			//获取原来的信息
	    			const goodsId = this.$route.query.goodsId;
	    			this.goodsId = goodsId;
	    			this.$http.get('api/admin/item/'+goodsId, {}, {emulateJSON: true}).then(function (response) {
	    				this.newGoodsForm.name = response.data.data.name;
	    				this.newGoodsForm.description = response.data.data.description;
	    				this.newGoodsForm.category_id = response.data.data.category_id;
	    				this.newGoodsForm.price = response.data.data.price;
	    				this.newGoodsForm.num = response.data.data.num;
	    				this.newGoodsForm.sales_num = response.data.data.sales_num;
	    				this.newGoodsForm.comment = response.data.data.comment;
	    				this.newGoodsForm.recommend = response.data.data.recommend;
	    				this.theme_pic = this.apiHead+response.data.data.pic_url_resize;
	            }, function (response) {
					if(response.status == 401 || response.status == 403){
						//session过期
						this.$router.push({ path: 'login'})
					}
					else{
						alert('对不起，请求错误，请重新请求哦！');
					}
					
	            })
	    			//获取分类信息
	    		 	this.$http.get('api/admin/categorys?pageNum=1&perPage=100', {}, {emulateJSON: true}).then(function (response) {
	        			var cateArr = response.data.data;
	        			for(var i =0; i<cateArr.length; i++){
	        				if(cateArr[i].status==0){
	        					var newCateObj = {
		        					'category': cateArr[i].name,
		        					'id':cateArr[i].id
		        				}
		        				this.cateList.push(newCateObj)
	        				}
	        				
	        			}
	            }, function (response) {
					if(response.status == 401 || response.status == 403){
						//session过期
						this.$router.push({ path: 'login'})
					}
					else{
						alert('对不起，请求错误，请重新请求哦！');
					}
					
	            })
	    		 	
	    		 	//获取轮播图
	    		 	this.getSwipePics();         
	            //获取描述图
	    		 	this.$http.get('api/admin/item_pic?type=desc&id='+goodsId, {}, {emulateJSON: true}).then(function (response) {
	        			this.descPicUrl =  this.apiHead+response.data.data[0].pic_url_resize;
	            }, function (response) {
					if(response.status == 401 || response.status == 403){
						//session过期
						this.$router.push({ path: 'login'})
					}
					else{
						alert('对不起，请求错误，请重新请求哦！');
					}
					
	            })
	    },
	    components:{
	    		dropzone, multidrop
	    },
	    methods:{
	    		//获取轮播图
	    		getSwipePics(){
	    			this.$http.get('api/admin/item_pic?type=product&id='+this.goodsId, {}, {emulateJSON: true}).then(function (response) {
	    				var swipeArr = response.data.data;
	    				for(var i =0 ;i<swipeArr.length; i++){
	    					var obj = {
	    						'id': swipeArr[i].id,
	    						'swipe_pic_url_resize': this.apiHead+swipeArr[i].pic_url_resize
	    					}
	    					this.swipePics.push(obj);
	    				}
	            }, function (response) {
					if(response.status == 401 || response.status == 403){
						//session过期
						this.$router.push({ path: 'login'})
					}
					else{
						alert('对不起，请求错误，请重新请求哦！');
					}
					
	            });

	    		},
	    		//删除图片
	    		deleteSwipe(id){
	    			var _this = this;
	    			this.$confirm('是否删除该商品图片?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		        		_this.$http.delete('api/admin/item_pic?id='+_this.goodsId+'&item_pic_id='+id+'&type=product', {}, {emulateJSON: true}).then(function (response) {
	        			if(response.data.code=='000000'){
	        				_this.$message({
				          message: '删除成功',
				          type: 'success'
				       });
	        				_this.getSwipePics()
	        			}
	        			
	            }, function (response) {
					if(response.status == 401 || response.status == 403){
						//session过期
						this.$router.push({ path: 'login'})
					}
					else{
						alert('对不起，删除失败，请重新请求哦！');
					}
					
	            });
			       
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消'
		          });          
		        });
	    			
	    			
	    		},
	    		
    			submitForm(formName) {
	          var _this = this;
	        	  	this.$refs[formName].validate((valid) => {
		          if (valid) {
		            _this.$http.put(_this.newUrl, _this.newGoodsForm, {emulateJSON: true}).then(function (response) {
	        			if(response.data.code=='000000'){
	        				_this.$message({
				          message: '修改商品成功',
				          type: 'success'
				       });
	        			}
	        			
	            }, function (response) {
					if(response.status == 401 || response.status == 403){
						//session过期
						this.$router.push({ path: 'login'})
					}
					else{
						alert('对不起，删除失败，请重新请求哦！');
					}
					
	            });
		          } 
		          else {
		            return false;
		          }
	        		});
		    }
	    },
	    computed:{
	    		newUrl: function(){
	    			const goodId = this.$route.query.goodsId;
	    	 		return 'api/admin/item/'+goodId;
	    		}
	    }
	}
</script>

<style scoped>
 @import url('~dropzone/dist/dropzone.css');
  @import 'https://fonts.googleapis.com/css?family=Roboto';
	.el-row{
		border: 1px solid gainsboro;
		padding: 8px;
		border-radius: 4px;
		font-size: 14px;
		margin-bottom:20px;
	}
	
	.grid-content{
		line-height: 22px;	
	}
	
	.el-input{
		width: 70%;
	}
	
	.el-input{
		width: 70%;
	}
	
	.select_area{
		height:36px;
		line-height: 1;
		outline: 0;
		border: 1px solid #bfcbd9;
		border-radius: 4px;
	}
	
	.el-row{
		border: 1px solid gainsboro;
		padding: 8px;
	}
	
	.grid-content{
		line-height: 36px;	
	}
	
	.newBtn{
		float: right;
		height: 36px;
	}
	
	.new_user_form{
		width:600px;
	}
	
	
	.el-checkbox-group{
		display: inline-block;
		margin-right: 16px;
	}
	
	.swipe{
		display: inline-block;
	}
	
	.swipe img{
		
		margin: 10px;
		width:150px;
		height:150px;
	}
</style>