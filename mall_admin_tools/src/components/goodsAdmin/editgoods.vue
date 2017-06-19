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
		  	<el-button class="newBtn" type="info" @click="backtoGoods">返回商品列表</el-button>
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
				    class="red_color"
				  >
					
					<dropzone ref="theme_dropzone" id="themeSuccess" method="put" auto-process-queue="true" :url="newUrl" v-on:vdropzone-success="themeSuccess">
					 </dropzone>
					  <span>直接上传一张需要替换的产品主图即可</span>
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
				    label="更换产品轮播图"
				    prop="pics"
				  >
					 <multidrop ref="swipe_dropzone" id="swipeVueDropzone" auto-process-queue="true" url="api/admin/item_pic" v-on:vdropzone-sending="addProductParams" v-on:vdropzone-success="prodSuccess">
					 </multidrop>
					  <span>直接上传新的轮播图即可</span>
				</el-form-item>
				
				<el-form-item
				    label="产品详情描述图"
				    prop="pics"
				    style="width:900px;"
				  >
				   <div class="swipe" v-for="item in descPics">
				  	<i class="el-icon-close" style="position:absolute;" @click="deleteDesc(item.id)"></i>
				  	 <img :src="item.desc_pic_url_resize" />
				  </div>
				</el-form-item>
				
				<el-form-item
				    label="更换详情描述图"
				    prop="pics"
				  >
				  <multidrop ref="desc_dropzone" id="descVueDropzone" auto-process-queue="true" url="api/admin/item_pic" v-on:vdropzone-sending="addDescParams" v-on:vdropzone-success="descSuccess">
					 </multidrop>
					  <span>直接上传新的详情描述图即可</span>
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
	        	descPicUrl:'',
	        	swipePics: [],
	        	descPics: [],
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
	    		 	//获取基本信息
	    		 	this.getBasicInfo()
	    		 	
	    		 	//获取轮播图
	    		 	this.getSwipePics();         
	           		 //获取描述图
	    		 	this.getDescPic();
	    },
	    components:{
	    		dropzone, multidrop
	    },
	    methods:{
	    		//返回商品列表
	    		backtoGoods(){
	    			this.$router.push({ path: 'goodslist'})
	    		},
	    		
	    		//更换主图成功
	    		'themeSuccess':function(file,response){
	    			if(response.code=='000000'){
	    				this.$message({
				          message: '产品主图更换成功',
				          type: 'success'
				    	});
				    	
				    	this.getBasicInfo();
				    	this.$refs.theme_dropzone.removeAllFiles()
	    			}
	    		},
	    		
	    		//轮播图添加之前
	    		'addProductParams':function(file,xhr,formData){
			      	formData.append("id", this.goodsId);
			    	formData.append("type", 'product');
			    },
			    
			    //轮播图添加成功
			    'prodSuccess':function (file, response) {
		        	if(response.code == '000000'){
		    		  	this.$message({
				          message: '轮播图修改成功',
				          type: 'success'
				       	});
				       	this.getSwipePics();
				    	this.$refs.swipe_dropzone.removeAllFiles()
			    	}
			    	else{
			    		this.$message.error('产品描述图修改失败，请重试哦');
			    	}
		      	},
	    		
	    		//描述图添加之前
	    		'addDescParams':function(file,xhr,formData){
			      	formData.append("id", this.goodsId);
			    	formData.append("type", 'desc');
			    },
			    
			    //描述图添加成功
			    'descSuccess': function (file, response) {
		        	if(response.code == '000000'){
		    		  	this.$message({
				          message: '描述图修改成功',
				          type: 'success'
				       	});
				       	this.getDescPic();
				    	this.$refs.desc_dropzone.removeAllFiles()
			    	}
			    	else{
			    		this.$message.error('产品描述图修改失败，请重试哦');
			    	}
		      	},
	    		
	    		//获取基本信息和主图
	    		getBasicInfo(){
		    		this.$http.get('api/admin/item/'+this.goodsId, {}, {emulateJSON: true}).then(function (response) {
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
	    		},
	    		
	    		//获取轮播图
	    		getSwipePics(){
	    			this.$http.get('api/admin/item_pic?type=product&id='+this.goodsId, {}, {emulateJSON: true}).then(function (response) {
	    				var swipeArr = response.data.data;
	    				this.swipePics=[];
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
	    		
	    		//获取描述图
	    		getDescPic(){
	    			this.$http.get('api/admin/item_pic?type=desc&id='+this.goodsId, {}, {emulateJSON: true}).then(function (response) {
	    				var descPicArr = response.data.data;
	    				this.descPics = [];
	    				for(var i =0 ;i<descPicArr.length; i++){
	    					var obj = {
	    						'id': descPicArr[i].id,
	    						'desc_pic_url_resize': this.apiHead+descPicArr[i].pic_url_resize
	    					}
	    					this.descPics.push(obj);
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
	    		},
	    		
	    		//删除轮播图片
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
	    		
	    		//删除描述图
	    		deleteDesc(id){
	    			var _this = this;
	    			this.$confirm('是否删除该描述图片?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        		_this.$http.delete('api/admin/item_pic?id='+_this.goodsId+'&item_pic_id='+id+'&type=desc', {}, {emulateJSON: true}).then(function (response) {
		        			if(response.data.code=='000000'){
		        				_this.$message({
						          message: '删除成功',
						          type: 'success'
						       });
		        				_this.getDescPic()
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
	
	.red_color .el-form-item__label{
		color:red !important;
	}
</style>