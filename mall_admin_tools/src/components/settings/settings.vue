<template>
	<div>
		<!--导航栏-->
		<el-row>
		  <el-col :span="24">
		  	<div class="grid-content bg-purple-dark">
		  	修改密码
		  	</div>
		  </el-col>
		</el-row>
		
		<!--表单-->
		<el-form :model="changePwdForm" ref="changePwdForm" :rule="formRule" label-width="100px" class="new_user_form">
				
			<el-form-item 
			    label="原密码"
			    prop="oldpwd"
			    :rules = "checkPwdRules"
			>
			    <el-input type="password" v-model="changePwdForm.oldpwd" auto-complete="off"></el-input>
			</el-form-item>
		
			<el-form-item 
			    label="新密码"
			    prop="newpwd"
			    :rules = "checkPwdRules"
			>
			    <el-input type="password" v-model="changePwdForm.newpwd" auto-complete="off"></el-input>
			</el-form-item>
			
			<el-form-item 
			    label="确认密码"
			    prop="repeatPwd"
			    :rules = "checkPwdRules"
			>
			    <el-input type="password" v-model="changePwdForm.repeatPwd" auto-complete="off"></el-input>
			</el-form-item>	
				
			  <el-form-item>
			    <el-button type="primary"  @click="submitForm('changePwdForm')">提交</el-button>
			  </el-form-item>
			</el-form>
	</div>
</template>

<script>
	export default {
	    data() {
	    	//密码校验
	    	var checkPassword = (rule, value, callback) => {
	    		if(!value){
	    			callback(new Error('密码不得为空'));
	    		}
	        	else{
	        		callback()
	        	}
	    	};
	    	
	    	return {	
	        	//表单数据
	        	changePwdForm:{
	        		oldpwd: '',
	        		newpwd:'',
	        		repeatPwd: ''
	        	},
		        //表单校验规则
		        //密码校验
		        checkPwdRules:[
		        	{validator: checkPassword, trigger: 'blur'}
		        ]
	      	};
	    },
	    methods:{
	    	submitForm(formName) {
		        this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	if(this.changePwdForm.newpwd == this.changePwdForm.repeatPwd){
		          		var submitData = {
		          			'password': this.changePwdForm.oldpwd,
		          			'new_password': this.changePwdForm.newpwd
		          		}
		          		this.$http.post('api/admin/auth/passwd/reset', submitData, {emulateJSON: true}).then(function (response) {
		          			if(response.data.respCode=='000000'){
		          				//成功了
		          				this.$message({
						          message: '修改密码成功！',
						          type: 'success'
						        });
						        //this.$router.push({ path: '/notice'})
						        this.$refs[formName].resetFields();
		          			}
		          			else{
		          				this.$message({
						          message: response.data.respMsg,
						          type: 'info'
						        });
		          			}
		                }, function (response) {
		                	this.abledBtn = false;
							if(response.status == 401 || response.status == 403){
								//session过期
								this.$router.push({ path: '/login'})
							}
							else{
								alert('对不起，请求错误，请重新请求哦！');
							}
							
		                })
		          	}
		          	
		          	else{
		          		this.$message.error('两次密码输入不一致')
		          	}
		          }
		          else {
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
	
</style>