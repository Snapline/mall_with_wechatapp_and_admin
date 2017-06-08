<template>
<div class="container">
	
     <el-form :model="loginForm" label-width="100">
     	<h1 style="text-align: center; margin:20px;">帮充管理平台登录</h1>
        <el-form-item label="用户名">
            <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input type="password" v-model="loginForm.password" @keyup.enter="loginSubmit"></el-input>
        </el-form-item>
        <el-form-item label="" v-show="error">
            <p style="color:red">您的用户名或密码错误</p>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="loginSubmit">登录</el-button>
        </el-form-item>
    </el-form>

</div>
</template>

<script>
export default {
    data () {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            error: false
        }
    },
    methods: {
    	loginSubmit(){
    		var self = this;
        	self.$http.get('api/login?username='+self.loginForm.username+'&password='+self.loginForm.password, {}, {emulateJSON: true}).then(function (response) {
        		console.log(response)
          		if(response.data.code=='0'){
          			//登录成功
          			this.error = false
          			this.$router.push({ path: '/userauth'})
          		}
          		else{
          			this.error = true
          		}
            }, function (response) {
				alert('对不起，请求错误，请重新请求！');
            })
    	}
    }
}
</script>

<style scoped>
	.login-body{
		background : #557686; 
	}
	
	.container{
		margin:100px auto;
		width: 400px;
	}
	
	.ivu-input{
		width:74%;
	}
</style>