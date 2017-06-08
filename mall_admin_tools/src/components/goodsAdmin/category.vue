<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>分类管理</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!--新建栏-->
		<el-row style="margin-bottom:30px; margin-top:30px;">
		  <el-col :span="24">
		  	<div class="grid-content bg-purple-dark">
		  	分类列表
		  	<el-button class="newBtn" type="info" @click="createUser">添加新类</el-button>
		  	</div>
		  </el-col>
		</el-row>
		
		
		<!--分类列表-->
		<el-table
		    :data="tableData"
		    stripe
		    v-loading.body="tableLoading"
		    style="width: 100%">
		    <el-table-column
		      prop="category"
		      label="分类名称">
		    </el-table-column>
		    
		     <el-table-column
		      label="操作">
		      <template scope="scope">
		        <el-button @click="editType(scope.row.id, scope.row.category)" type="info" size="small">修改类名</el-button>
		        <el-button @click="deleteType(scope.row.id)" type="danger" size="small">删除</el-button>
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
	        	tableData:[],
	        	totalPage:10
	      	};
	    },
	    created(){
	    	this.userInfoRequest(1);
	    },
	    methods:{
		    //编辑用户信息
		    editType(id, cateName){
		    	this.$prompt('请输入新的分类名称', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消'
		        }).then(({ value }) => {
		          this.$message({
		            type: 'success',
		            message: '你的新类别名称是: ' + value
		          });
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '取消输入'
		          });       
		        });
		    },
		    
		    //删除用户信息
		    deleteType(id){
		    	this.$confirm('是否删除该分类?', '提示', {
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
								alert('对不起，删除商分类失败，请重新请求！');
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
            	self.$http.post('/cateInfo', {}, {emulateJSON: true}).then(function (response) {
            		this.tableLoading = false;
              		this.tableData = response.data.cateInfo;
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