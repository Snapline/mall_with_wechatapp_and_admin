<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components:{
  },
  data(){
    return{
    }
  }
}
</script>

<style>
 @import "../static/css/main.css";
    @import "../static/css/colordark.css";     /*深色主题*/
  html, body, ul, li, ol, dl, dd, dt, p, h1, h2, h3, h4, h5, h6, form, fieldset, legend, img { 
  margin:0; padding:0; 
}
html,body{
  height: 100%;
  width: 100%;
  font-family: "微软雅黑"
}
li{
  list-style: none
}
a{
  text-decoration: none;
}
#app{
  height: 100%;
  display: flex;
  flex-direction: column;
}

/*强制修改base64插件的图片大小*/
	.profile{
		width: 120px !important;
		height:120px !important;
		border-radius: 50%;
	}
	
	.profile_input{
		border:1px solid #bfcbd9;
		background-color: #fff;
		height: 36px;
		line-height: 1;
		border-radius: 4px;
		padding-left: 10px;
		width: 290px !important;
	}
	
	.el-upload--text{
		width:auto !important;
		height: auto !important;
		border: none;
	}
	
	.el-upload-list{
		width:300px !important;
	}
	
	.el-table .cell, .el-table th>div{
		padding-right: 0px !important;
	}
	
	.upload_finance_area .el-upload-list{
		display: inline-block!important;
		position: absolute;
		margin-left: 30px;
	} 
</style>
