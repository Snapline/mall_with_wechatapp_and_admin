<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/goodslist' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>添加分类</el-breadcrumb-item>
		</el-breadcrumb>
		<!--新建栏-->
		<el-row style="margin-bottom:30px; margin-top:30px;">
		  <el-col :span="24">
		  	<div class="grid-content bg-purple-dark">
		  	添加分类
		  	<el-button class="newBtn" type="info" @click="backToCate">返回分类列表</el-button>
		  	</div>
		  </el-col>
		</el-row>
		
		<!--表单-->
		<el-form :model="newCateForm" ref="newCateForm" :rule="formRule" label-width="100px" class="new_user_form">
				
			  <el-form-item
			    label="类名"
			    prop="name"
			    :rules="checkEmptyRules"
			  >
			    <el-input type="text" v-model="newCateForm.name" auto-complete="off"></el-input>
			  </el-form-item>
			  
				<el-form-item
				    label="分类图片"
				    prop="pics"
				  >
					 <dropzone ref="dropzone" id="myVueDropzone"  url="api/admin/categorys" v-on:vdropzone-sending="addParams" v-on:vdropzone-success="success">
					 </dropzone>
					 <span>此类型只能上传一张!</span>
				</el-form-item>
				
			  <el-form-item>
			    <el-button type="primary" @click="submitForm('newCateForm')">提交</el-button>
			  </el-form-item>
			</el-form>
	</div>
</template>

<script>
	import dropzone from '../general/catedropzone.vue'
	export default {
	    data() {
	    	var checkEmptyString = (rule, value, callback) => {
	    		if(!value){
	    			callback(new Error('类名不得为空'));
	    		}
	    		else{
	    			callback()
	    		}
	    	}; 
	    	return {		
	        	//表单数据
	        	newCateForm:{
	        		name:''
	        	},
	        	processQueue: false,
	        	//空值校验
		        checkEmptyRules:[
		        	{validator: checkEmptyString, trigger: 'blur'}
		        ]
	      	};
	    },
	    created(){
	    	
	    },
	    components:{
	    	dropzone
	    },
	    methods:{
	    	'addParams':function(file,xhr,formData){
	    		formData.append(
	    			"name", this.newCateForm.name
	    		)
	    	},
	    	'success': function (file, response) {
		        	if(response.code == '000000'){
		    		  this.$message({
				          message: '添加成功，正在跳转...',
				          type: 'success'
				        });
		    		 this.$router.push({ path: 'category'})
			    	}
			    	else{
			    		this.$message.error('添加失败，请重试哦');
			    	}
		      },
//	      'process': function () {
//	        var newArr = this.$children.filter(function(item){
//	          return item.id === "myVueDropzone";
//	        });
//	        var component = newArr[0];
//	        console.log('上传了一次')
//	        component.processQueue()
//	      },
	    	//返回
	    	backToCate(){
	    		this.$router.push({ path: 'category'})
	    	},
	    	//提交
	    	submitForm(formName) {
	    		var _this = this;
		        this.$refs[formName].validate((valid) => {
		            _this.$refs.dropzone.processQueue()
		        });
		        
		    },
		    catePicsSuc(response, file, fileList){
		    	if(response.data.code == '000000'){
		    		  this.$message({
				          message: '添加成功，正在跳转...',
				          type: 'success'
				        });
		    		 this.$router.push({ path: 'category'})
		    	}
		    	else{
		    		this.$message.error('添加失败，请重试哦');
		    	}
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
	
	#myVueDropzone{
		width: 400px !important;
	}
</style>