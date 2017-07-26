<template>
<div class="container">
    <form class="form-signin" id="login_form" action method>
        <div class="form-signin-heading text-center">
            <h1 class="sign-title">串门核雕后台管理系统</h1>
        </div>
        <div class="login-wrapped">
        	<input type="text" class="el-input__inner" v-model="loginForm.username" placeholder="用户名"></input>
        	<input type="password" class="el-input__inner" v-model="loginForm.password" placeholder="密码" @keyup.enter="loginSubmit"></input>
            
            <p v-show="error" style="color:red; font-size:14px; margin-bottom:10px;">您的用户名或密码错误</p>
            
           <el-button type="success" @click="loginSubmit">登录</el-button>

        </div>
    </form>

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
        	self.$http.post('api/admin/auth/login', {'name':self.loginForm.username,'password':self.loginForm.password}, {emulateJSON: true}).then(function (response) {
          		if(response.data.respCode=='000000'){
          			//登录成功
          			this.error = false
          			this.$router.push({ path: '/goodslist'})
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
	.container{
		margin:100px auto;
		width: 400px;
	}
	
	.ivu-input{
		width:74%;
	}
	
	.form-signin {
    max-width: 330px;
    margin: 50px auto;
    background: #fff;
    border-radius: 5px;
    -webkit-border-radius: 5px;
}

.form-signin .form-signin-heading {
    margin: 0;
    padding: 25px 15px;
    text-align: center;
    color: #fff;
    position: relative;
}

.sign-title {
    font-size: 18px;
    color: #676767;
    top: -60px;
    left: 0;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
}

.form-signin .checkbox {
    font-weight: normal;
    color: #fff;
    font-weight: normal;
    position: absolute;
    bottom: -50px;
    width: 100%;
    left: 0;
}

.form-signin .checkbox a, .form-signin .checkbox a:hover {
    color: #fff;
}

.form-signin .form-control {
    position: relative;
    font-size: 16px;
    height: auto;
    padding: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.form-signin .form-control:focus {
    z-index: 2;
}

.form-signin input[type="text"], .form-signin input[type="password"] {
    margin-bottom: 15px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    border: 1px solid #eaeaec;
    background: #eaeaec;
    box-shadow: none;
    font-size: 12px;
}

.form-signin .btn-login {
    background: #6bc5a4;
    color: #fff;
    text-transform: uppercase;
    font-weight: normal;
    margin: 20px 0 5px;
    padding: 5px;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
    font-size: 30px;
}

.form-signin .btn-login:hover {
    background: #6bc5a4;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
}

.form-signin p {
    text-align: left;
    color: #b6b6b6;
    font-size: 16px;
    font-weight: normal;
}

.form-signin a, .form-signin a:hover {
    color: #6bc5a4;
}

.form-signin a:hover {
    text-decoration: underline;
}

.login-wrapped {
    padding: 0 20px 20px;
    position: relative;
}

</style>