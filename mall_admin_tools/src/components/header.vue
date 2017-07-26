<template>
    <div class="header">
        <div class="logo">电商管理系统</div>
        <div class="user-info">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                   	<!--<span style="margin-right:20px;">{{userName}}</span>-->
                    <el-button @click="logout">退出</el-button>
                </span>
                <!--<el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>-->
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                userName: ''
            }
        },
		created(){
//			this.$http.get('api/ajax/user/findUser', {}, {emulateJSON: true}).then(function (response) {
//      		this.userName = response.data.result.username
//          }, function (response) {
//				alert('对不起，请求错误，请重新请求！');
//          })
		},
        methods:{
            logout(){
            	this.$http.post('api/admin/auth/logout', {}, {emulateJSON: true}).then(function (response) {
	        		console.log(response)
	          		if(response.data.respCode=='000000'){
	          			this.$router.push({ path: 'login'})
	          		}
	          		else{
	          			alert('退出失败，请重试！');
	          		}
	            }, function (response) {
					alert('对不起，请求错误，请重新请求！');
	            })
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>