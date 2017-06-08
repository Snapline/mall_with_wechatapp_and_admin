<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--新建栏-->
		<el-row style="margin-bottom:30px; margin-top:30px;">
		  <el-col :span="24">
		  	<div class="grid-content bg-purple-dark">
		  	商品列表
		  	<el-button class="newBtn" type="info" @click="createGoods">添加</el-button>
		  	</div>
		  </el-col>
		</el-row>
		
		
		<!--用户列表-->
		<el-table
		    :data="tableData"
		    stripe
		    v-loading.body="tableLoading"
		    style="width: 100%">
		    <el-table-column
		      prop="smallpic"
		      label="缩略图">
		    </el-table-column>
		    <el-table-column
		      prop="goodsName"
		      label="名称">
		    </el-table-column>
		    <el-table-column
		      prop="category"
		      label="分类">
		    </el-table-column>
		    <el-table-column
		      prop="price"
		      label="价格">
		    </el-table-column>
		     <el-table-column
		      label="操作">
		      <template scope="scope">
		        <el-button @click="editUser(scope.row.id, scope.row.realName, scope.row.nickName, scope.row.username, scope.row.roleIds)" type="info" size="small">修改</el-button>
		        <el-button @click="deleteUser(scope.row.id)" type="warning" size="small">删除</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
			
			<!--列表翻页-->
			<div class="block" style="float: right; margin-top:30px;">
			  <el-pagination
			    layout="prev, pager, next"
			    :total="totalPage" @current-change="changePage">
			  </el-pagination>
			</div>
	</div>
</template>

<script>
	import data from '../../mock/data.js'
	export default {
	    data() {
	    	return {
	    		tableLoading: true,
	        	//页码数据
	        	curPage:1,
	        	totalPage:10,
	        	tableData:[], //表格数据
	      	};
	    },
	    created(){
	    	this.userInfoRequest(1);
	    },
	    methods:{
	    	//添加跳转
	    	createGoods(){
	    		this.$router.push({ path: 'addgoods'})
	    	},
		    //编辑用户信息
		    editUser(id, realname, nickname, phonenum, roleids){
		    	//初始化 打开弹窗，取消Tips显示，表单数据同步更新，隐藏表单的密码框，显示并重置修改的密码框，编辑状态为true
	    		this.addUserTips = false;
	    		this.isEditState = true;
	    		this.newUserVisible = true;
	    		if(this.$refs['newUserForm']){
	    			this.$refs['newUserForm'].resetFields();
	    		}
	    		
	    		this.newUserForm = {
	    			editId: id,
	        		realName: realname,
	        		nickName: nickname,
	        		phone: phonenum,
	        		password:'123youcannotguess',//为了让表单验证通过，需要填写一个内置密码
	        		editPassword:'',
	        		roles:roleids
	        	}
		    },
		    
		    //删除用户信息
		    deleteUser(id){
		    	this.$confirm('是否删除该商品?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.$http.post('api/ajax/user/remove', {'id':id}, {emulateJSON: true}).then(function (response) {
		            	this.userInfoRequest(this.curPage)
			            }, function (response) {
							if(response.status == 401 || response.status == 403){
								//session过期
								this.$router.push({ path: 'login'})
							}
							else{
								alert('对不起，删除商品失败，请重新请求！');
							}
			            })
			       
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消'
		          });          
		        });
		    },
		    //获取用户列表
		    userInfoRequest(oPage){
		    	var self = this;
		    	this.tableLoading = true;
            	self.$http.post('/goodsInfo', {}, {emulateJSON: true}).then(function (response) {
            		this.tableLoading = false;
              		this.tableData = response.data.goodsInfo;
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
		    //翻页
		    changePage(val){
		    	this.curPage = val;
		    	this.userInfoRequest(val)
		    }
	    }
	};
</script>

<style scoped>
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
	
	.el-checkbox-group{
		display: inline-block;
		margin-right: 16px;
	}
	
	/*.el-checkbox, .el-checkbox{
		margin-left:0!important;
		margin-right:10px;
		width:60px;
		display: inline-block;
	}
	*/
	.new_user_form{
		width:460px;
	}
</style>