<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/goodslist' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>
		<!--新建栏-->
		<el-row style="margin-bottom:30px; margin-top:30px;">
		  <el-col :span="24">
		  	<div class="grid-content bg-purple-dark">
		  	添加商品
		  	<el-button class="newBtn" type="info" @click="createUser">返回商品列表</el-button>
		  	</div>
		  </el-col>
		</el-row>
		
		<!--表单-->
		<el-form :model="newGoodsForm" ref="newGoodsForm" :rule="formRule" label-width="150px" class="new_user_form">
				
			  <el-form-item
			    label="标题"
			    prop="title"
			    :rules="{ required: true, message: '必须填入宝贝标题', trigger: 'blur' }"
			  >
			    <el-input type="text" v-model="newGoodsForm.title" auto-complete="off"></el-input>
			  </el-form-item>
			  
			  <el-form-item
			    label="简洁描述"
			    prop="description"
			  >
			    <el-input type="textarea" v-model="newGoodsForm.description" auto-complete="off"></el-input>
			  </el-form-item>
			  
			  <el-form-item
			    label="分类"
			    prop="category"
			  >
			  	   	<el-radio-group v-model="newGoodsForm.category" v-for="item in cateList">
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
				    prop="goodsNum"
				    :rules="checkIntRules"
				>
				   <el-input type="text" v-model="newGoodsForm.goodsNum" auto-complete="off"></el-input>
				</el-form-item>
				
				<el-form-item
				    label="已售数量"
				    prop="soldGoodsNum"
				>
				   <el-input type="text" placeholder="注意数量不要超过库存量哦" v-model="newGoodsForm.soldGoodsNum" auto-complete="off"></el-input>
				</el-form-item>
				
				<el-form-item
				    label="好评率"
				    prop="comment"
				>
				   <el-input type="text" placeholder="如想要99%好评率就填入99，不要超100" v-model="newGoodsForm.comment" auto-complete="off"></el-input>
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
				    <!--<el-upload
					  ref="goodsPic"
					  class="upload_area"
					  :data="fileSendName"
					  action="api/supplier/addLicense"
					  name="goodspic"
					  :auto-upload="false" 
					  :on-success="goodsPicsSuc">
					  <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
					</el-upload>-->
					<dropzone ref="theme_dropzone" id="themeVueDropzone"  url="api/admin/items" v-on:vdropzone-sending="addThemeParams" v-on:vdropzone-success="themeSuccess">
					 </dropzone>
				</el-form-item>
				
				<el-form-item
				    label="产品轮播图"
				    prop="pics"
				  >
					<multidrop ref="swipe_dropzone" id="swipeVueDropzone" url="api/admin/item_pic" v-on:vdropzone-sending="addProductParams" v-on:vdropzone-success="prodSuccess">
					 </multidrop>
				</el-form-item>
				
				<el-form-item
				    label="产品详情描述图"
				    prop="pics"
				  >
					<dropzone ref="desc_dropzone" id="descVueDropzone"  url="api/admin/item_pic" v-on:vdropzone-sending="addDescParams" v-on:vdropzone-success="descSuccess">
					 </dropzone>
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
	    	return {	
	        	//表单数据
	        	newGoodsForm:{
	        		'title':'',
	        		'description':'',
	        		'category':0,
	        		'price': '',
	        		'goodsNum':'',
	        		'soldGoodsNum':'',
	        		'comment':'',
	        		'recommend':1
	        	},
	        	cateList:[],
	        	//之后的文件传输地址
	        	newId:0,
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
	    		//先获取分类信息
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
		    			this.newGoodsForm.category =this.cateList[1].id;
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
	    		//主图添加附带参数
	    		'addThemeParams':function(file,xhr,formData){
		    		formData.append("name", this.newGoodsForm.title)
		    		formData.append("description", this.newGoodsForm.description);
		    		formData.append("category_id", this.newGoodsForm.category);
		    		formData.append("price", this.newGoodsForm.price);
		    		formData.append("num", this.newGoodsForm.goodsNum);
		    		formData.append("sales_num", this.newGoodsForm.soldGoodsNum);
		    		formData.append("comment", this.newGoodsForm.comment);
		    		formData.append("recommend", this.newGoodsForm.recommend);
		    		
		    	},
		    	//主图上传完成
		    	'themeSuccess': function (file, response) {
		        	if(response.code == '000000'){
		        		//this.secondFileUrl = 'api/admin/item_pic/'+response.id;
		        		this.newId = response.id;
		    		  	this.$message({
				          message: '产品主图上传成功',
				          type: 'success'
				    });
				    	this.$refs.swipe_dropzone.processQueue();
				    
			    	}
			    	else{
			    		this.$message.error('添加失败，请重试哦');
			    	}
		      },
		      //轮播图附带参数
		      'addProductParams':function(file,xhr,formData){
		      	formData.append("id", this.newId);
		    		formData.append("type", 'product');
		      },
		      //轮播图上传完成
		       'prodSuccess': function (file, response) {
		        	if(response.code == '000000'){
		    		  	this.$message({
				          message: '产品轮播图上传成功',
				          type: 'success'
				    });
				    this.$refs.desc_dropzone.processQueue();
			    	}
			    	else{
			    		this.$message.error('产品轮播图上传失败，请重试哦');
			    	}
		      },
		       //描述图附带参数
		      'addDescParams':function(file,xhr,formData){
		      	formData.append("id", this.newId);
		    		formData.append("type", 'desc');
		      },
		      //描述图上传完成
		       'descSuccess': function (file, response) {
		        	if(response.code == '000000'){
		    		  	this.$message({
				          message: '描述图上传成功',
				          type: 'success'
				       });
			    	}
			    	else{
			    		this.$message.error('产品描述图上传失败，请重试哦');
			    	}
		      },
	    			submitForm(formName) {
		          var _this = this;
		        	  this.$refs[formName].validate((valid) => {
			          if (valid) {
			             _this.$refs.theme_dropzone.processQueue()
			          } 
			          else {
			            return false;
			          }
		        });
		    }
	    },
	    computed:{
	    		secondFileUrl:function(){
	    			return 'api/admin/item_pic/'+this.newId
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
</style>