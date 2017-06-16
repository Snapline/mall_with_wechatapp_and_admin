<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/goodslist' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>修改分类</el-breadcrumb-item>
		</el-breadcrumb>
		<!--新建栏-->
		<el-row style="margin-bottom:30px; margin-top:30px;">
		  <el-col :span="24">
		  	<div class="grid-content bg-purple-dark">
		  	修改分类
		  	<el-button class="newBtn" type="info" @click="backToCate">返回分类列表</el-button>
		  	</div>
		  </el-col>
		</el-row>
		
		<!--表单-->
		<el-form :model="newCateForm" ref="newCateForm" :rule="formRule" label-width="120px" class="new_user_form">
				
			  <el-form-item
			    label="类名"
			    prop="name"
			    :rules="{ required: true, message: '必须填入类名', trigger: 'blur' }"
			  >
			    <el-input type="text" v-model="newCateForm.name" auto-complete="off"></el-input>
			  </el-form-item>
			  
			  <el-form-item
			    label="分类图片"
			    prop="name"
			  >
			    <img :src="previousPic" />
			  </el-form-item>
			  
				<el-form-item
				    label="修改分类图片"
				    prop="pics"
				  >
					 <dropzone ref="dropzone" id="myVueDropzone" method="put" :url="editCateUrl" v-on:vdropzone-sending="addParams"
					 	v-on:vdropzone-file-added="(hasAddedFile=hasAddedFile+1)" v-on:vdropzone-removed-file="(hasAddedFile=hasAddedFile-1)" v-on:vdropzone-success="success">
					 </dropzone>
				</el-form-item>
				
				 <el-form-item
				    label=""
				  >
			     <span>若想修改分类图片，传新的图片即可</span>
			  </el-form-item>
				
			  <el-form-item>
			    <el-button type="primary" @click="submitForm('newCateForm')">提交</el-button>
			  </el-form-item>
			</el-form>
	</div>
</template>

<script>
	import dropzone from '../general/catedropzone.vue'
	import API from '../request/api.js'
	export default {
	    data() {
	    	return {	
	        	//表单数据
	        	newCateForm:{
	        		name:''
	        	},
	        	previousPic: '',
	        	hasAddedFile: 0,
	        	processQueue: false
	      	};
	    },
	    created(){
	    	
	    	const catePic = API.APIDomain+this.$route.query.catePic;
	    	const cateName = this.$route.query.cateName;
	    	
	    	this.newCateForm.name = cateName;
	    	this.previousPic = catePic;
	    },
	    components:{
	    	dropzone
	    },
	    computed:{
	    	 editCateUrl:function(){
	    	 	const cateId = this.$route.query.cateId;
	    	 	return 'api/admin/category/'+cateId;
	    	 }
	    },
	    methods:{
	    	'addParams':function(file,xhr,formData){
	    		formData.append(
	    			"name", this.newCateForm.name
	    		)
	    	},
	    	'success': function (file) {
		        console.log('传了一个文件')
		    },
	    	//返回
	    	backToCate(){
	    		this.$router.push({ path: 'category'})
	    	},
	    	//提交
	    	submitForm(formName) {
	    		if(this.hasAddedFile>0){
	    			this.$refs.dropzone.processQueue()
	    		}
	    		else{
	    			this.$http.put(this.editCateUrl, {'name':this.newCateForm.name}, {emulateJSON: true}).then(function (response) {
              		
                }, function (response) {
					if(response.status == 401 || response.status == 403){
						//session过期
						this.$router.push({ path: 'login'})
					}
					else{
						alert('对不起，修改失败，请重新请求哦！');
					}
					
                })
	    		}
		        
		    },
		    catePicsSuc(response, file, fileList){
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