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
		<el-form :model="newGoodsForm" ref="newGoodsForm" :rule="formRule" label-width="100px" class="new_user_form">
				
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
			  	   	<el-checkbox-group v-model="newGoodsForm.category" v-for="item in cateList">
				    	<div style="display:inline-block;">
				    		<el-checkbox :label="item.id">{{item.category}}</el-checkbox>
				    	</div>
				    
					</el-checkbox-group>
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
				   <el-input type="text" v-model="newGoodsForm.price" auto-complete="off"></el-input>
				</el-form-item>
				
				<el-form-item
				    label="产品图"
				    prop="pics"
				  >
				    <el-upload
					  ref="goodsPic"
					  class="upload_area"
					  :data="fileSendName"
					  action="api/supplier/addLicense"
					  name="goodspic"
					  :auto-upload="false" 
					  :on-success="goodsPicsSuc">
					  <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
					</el-upload>
				</el-form-item>
				
			  <el-form-item>
			    <el-button type="primary" @click="submitForm('newGoodsForm')">提交</el-button>
			    <!--<el-button @click="clearForm">取消</el-button>-->
			  </el-form-item>
			</el-form>
	</div>
</template>

<script>
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
	        		category:[]
	        	},
	        	cateList:[],
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
        	this.$http.post('/cateInfo', {}, {emulateJSON: true}).then(function (response) {
        		console.log(response)
          		this.cateList = response.data.cateInfo;
          		var initCheckboxValue = [];
	    		initCheckboxValue.push(this.cateList[1].id);
	    		this.newGoodsForm = {
	        		'category': initCheckboxValue
	        	};
            }, function (response) {
				if(response.status == 401 || response.status == 403){
					//session过期
					this.$router.push({ path: 'login'})
				}
				else{
					alert('对不起，供应商列表请求错误，请重新请求哦！');
				}
				
            })
	    },
	    methods:{
	    	submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          if (valid) {
		            //step1  先传不带有图片的其他数据
	    			var self = this;
	    			var submitData = {
	    				'processId': 'cd8b001317df4115a964afc2ecc3ee10',
	    				'I_money':this.newGoodsForm.price,
	    				'I_max': 20000,
	    				'requestUsername': this.newGoodsForm.requestUsername,
	    				'supplierName': this.newGoodsForm.supplierObj.name,
	    				'company': this.newGoodsForm.supplierObj.company,
	    				'requestType': this.newGoodsForm.requestType,
	    				'threshold':this.newGoodsForm.supplierObj.threshold,
		        		'denomination':this.newGoodsForm.denomination,
		        		'cardType':this.newGoodsForm.cardType,
		        		'amount':this.newGoodsForm.amount,
		        		'discount':this.newGoodsForm.discount,
//		        		'price':this.newGoodsForm.price,
		        		'arrTime':this.newGoodsForm.arrTime,
		        		'remarks':this.newGoodsForm.remarks,
		        		'supplierId': this.newGoodsForm.supplierObj.id
	    			}
	    			
	    			if(this.newGoodsForm.requestType==1){
	    				submitData.operator = this.newGoodsForm.oilOperator
	    			}
	    			else{
	    				submitData.operator = this.newGoodsForm.mobileOperator
	    			}
	    			
	    			self.$http.post('api/snaker/flow/process', submitData, {emulateJSON: true}).then(function (response) {
	          			if(response.data.code=='100001'){
	          				//成功了
	          				this.$message({
					          message: '请款成功！',
					          type: 'success'
					        });
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
		          } else {
		            return false;
		          }
		        });
		    }
	    }
	}
</script>

<style scoped>
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
		width:460px;
	}
	
	
	.el-checkbox-group{
		display: inline-block;
		margin-right: 16px;
	}
</style>