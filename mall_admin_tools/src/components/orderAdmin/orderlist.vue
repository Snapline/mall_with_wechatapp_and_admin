<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
		    style="width: 100%">
		    <el-table-column
		      prop="orderId"
		      label="订单号">
		    </el-table-column>
		    
		    <el-table-column
		      prop="buyer"
		      label="买家名">
		    </el-table-column>
		    
		    <el-table-column
		      prop="address"
		      label="地址">
		    </el-table-column>
		    
		    <el-table-column
		      prop="status"
		      label="状态">
		    </el-table-column>
		    
		    <el-table-column
		      prop="price"
		      label="金额">
		    </el-table-column>
		    
		    <el-table-column
		      prop="date"
		      label="日期">
		    </el-table-column>
		    
		     <el-table-column
		      label="操作"
		      min-width="150">
		      <template scope="scope">
		        <el-button @click="sendGoods(scope.row.id)" type="warning" size="small">发货</el-button>
		        <el-button @click="checkDeliver(scope.row.id)" type="danger" size="small">查询物流</el-button>
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
	        	//页码数据
	        	curPage:1,
	        	totalPage:10,
	        	tableData:[] //表格数据
	      	};
	    },
	    created(){
	    	this.cateInfoRequest(1);
	    },
	    methods:{
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
		    
		    //删除
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
		    //获取
		    cateInfoRequest(oPage){
		    	var self = this;
            	self.$http.post('/orderInfo', {}, {emulateJSON: true}).then(function (response) {
              		this.tableData = response.data.orderInfo;
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
		    	this.cateInfoRequest(val)
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