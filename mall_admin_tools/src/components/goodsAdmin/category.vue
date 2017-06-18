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
		  	<el-button class="newBtn" type="info" @click="createCate">添加新类</el-button>
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
		      prop="pic"
		      label="类别图">
		      <template scope="scope">
		        <img style="width:50px;height:50px;" :src="apiHead+scope.row.pic_url_resize" />
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="分类名称">
		    </el-table-column>
		    <el-table-column
		      prop="status"
		      label="下架信息">
		       <template scope="scope">
		        <span v-if="scope.row.status==1" style="color:red">已下架</span>
		        <span v-else>上架中</span>
		      </template>
		    </el-table-column>
		    
		     <el-table-column
		      label="操作">
		      <template scope="scope">
		        <el-button @click="editType(scope.row.id, scope.row.pic_url_resize, scope.row.name)" type="info" size="small">修改类名</el-button>
		        <el-button v-show="scope.row.status==0" @click="deleteType(scope.row.id)" type="danger" size="small">下架</el-button>
		        <el-button v-show="scope.row.status==1" @click="restoreType(scope.row.id)" type="success" size="small">上架</el-button>
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
	import API from '../request/api.js'
	export default {
	    data() {
	    
	    	const generateData = _ => {
		        return API.APIDomain;
		      };
	    	return {
	    		tableLoading: true,
	        	//页码数据
	        	curPage:1,
	        	tableData:[],
	        	totalPage:10,
	        	apiHead: generateData()
	        	
	      	};
	    },
	    created(){
	   	 	this.categoryRequest(1);
	    },
	    methods:{
		    	//新建分类
		    	createCate(){
		    		this.$router.push({ path: 'addcategory'})
		    	},
		    //编辑分类信息
		    editType(id, catePic, cateName){
		    		this.$router.push({ path: 'editcategory', query:{'cateId':id, 'catePic':catePic, 'cateName':cateName}})
		    },
		    
		    //删除分类信息
		    deleteType(id){
		    	this.$confirm('是否下架该分类?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.$http.put('api/admin/category/'+id, {'status':1}, {emulateJSON: true}).then(function (response) {
		          		if(response.data.code=='000000'){
		          			 this.$message({
					          message: '下架成功',
					          type: 'success'
					        });
					        this.categoryRequest(this.curPage)
		          		}
		            			
		            }, function (response) {
						if(response.status == 401 || response.status == 403){
							//session过期
							this.$router.push({ path: 'login'})
						}
						else{
							alert('对不起，下架分类失败，请重新请求！');
						}
		            })
			       
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消'
		          });          
		        });
		    },
		    
		    restoreType(id){
		   	 	this.$confirm('是否上架架该分类?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.$http.put('api/admin/category/'+id, {'status':0}, {emulateJSON: true}).then(function (response) {
		          		if(response.data.code=='000000'){
		          			 this.$message({
					          message: '上架架成功',
					          type: 'success'
					        });
					        this.categoryRequest(this.curPage)
		          		}
		            			
		            }, function (response) {
						if(response.status == 401 || response.status == 403){
							//session过期
							this.$router.push({ path: 'login'})
						}
						else{
							alert('对不起，上架分类失败，请重新请求！');
						}
		            })
			       
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消'
		          });          
		        });
		    },
		    
		    //获取分类列表
		    categoryRequest(oPage){
		    	var self = this;
		    	this.tableLoading = true;
	        	self.$http.get('api/admin/categorys?pageNum='+oPage+'&perPage=10', {}, {emulateJSON: true}).then(function (response) {
	        			this.tableLoading = false;
	          		this.tableData = response.data.data;
	          		this.totalPage = response.data.total_page*10;
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
		    	this.categoryRequest(val)
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