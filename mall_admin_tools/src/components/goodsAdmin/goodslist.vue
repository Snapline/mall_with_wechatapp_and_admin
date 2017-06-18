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
		       <template scope="scope">
		        <img style="width:50px;height:50px;" :src="apiHead+scope.row.pic_url_resize" />
		      </template>
		    </el-table-column>
		    <el-table-column
		      prop="name"
		      label="名称">
		    </el-table-column>
		    <el-table-column
		      prop="category_name"
		      label="分类">
		    </el-table-column>
		    <el-table-column
		      prop="price"
		      label="价格">
		    </el-table-column>
		      <el-table-column
		      prop="status"
		      label="上架信息">
		       <template scope="scope">
		        <span v-if="scope.row.status==1" style="color:red">已下架</span>
		        <span v-else>上架中</span>
		      </template>
		    </el-table-column>
		     <el-table-column
		      prop="status"
		      label="广告信息">
		       <template scope="scope">
		        <span v-if="scope.row.index==0" style="color:orange">广告位</span>
		        <span v-else>非广告位</span>
		      </template>
		    </el-table-column>
		     <el-table-column
		      label="操作"
		      min-width="180">
		      <template scope="scope">
		        <el-button @click="editGoods(scope.row.id)" type="info" size="small">修改</el-button>
		         <el-button v-show="scope.row.status==0" @click="deleteGoods(scope.row.id)" type="danger" size="small">下架</el-button>
		        <el-button v-show="scope.row.status==1" @click="restoreGoods(scope.row.id)" type="success" size="small">上架</el-button>
		        
		         <el-button v-show="scope.row.index==0 && scope.row.status==0" @click="unPromoteGoods(scope.row.id)" type="danger" size="small">下广告</el-button>
		        <el-button v-show="scope.row.index==1 && scope.row.status==0" @click="promoteGoods(scope.row.id)" type="success" size="small">推广告</el-button>
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
		        	totalPage:10,
		        	tableData:[], //表格数据
		        	apiHead: generateData()
		        	
		     };
	    },
	    created(){
	    		this.itemInfoRequest(1);
	    },
	    methods:{
		    	//添加跳转
		    	createGoods(){
		    		this.$router.push({ path: 'addgoods'})
		    	},
		    //编辑商品信息
		    editGoods(id){
	    			this.$router.push({ path: 'editgoods', query:{'goodsId':id}})
		    },
		    
		    //下架
		    deleteGoods(id){
		    	 	this.$confirm('是否下架该商品?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.$http.put('api/admin/item/'+id, {'status':1}, {emulateJSON: true}).then(function (response) {
		          		if(response.data.code=='000000'){
		          			 this.$message({
					          message: '下架成功',
					          type: 'success'
					        });
					        this.itemInfoRequest(this.curPage)
		          		}
		            			
		            }, function (response) {
						if(response.status == 401 || response.status == 403){
							//session过期
							this.$router.push({ path: 'login'})
						}
						else{
							alert('对不起，下架商品失败，请重新请求！');
						}
		            })
			       
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消'
		          });          
		        });
		    	
		    },
		    
		    //上架
		    restoreGoods(id){
		   	 	this.$confirm('是否上架架该分类?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.$http.put('api/admin/item/'+id, {'status':0}, {emulateJSON: true}).then(function (response) {
		          		if(response.data.code=='000000'){
		          			 this.$message({
					          message: '上架成功',
					          type: 'success'
					        });
					        this.itemInfoRequest(this.curPage)
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
		    
		    //推上广告位
		    promoteGoods(id){
		    		this.$confirm('是否将该商品推上广告位?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.$http.put('api/admin/item/'+id, {'index':0}, {emulateJSON: true}).then(function (response) {
		          		if(response.data.code=='000000'){
		          			 this.$message({
					          message: '已成功上广告位',
					          type: 'success'
					        });
					        this.itemInfoRequest(this.curPage)
		          		}
		            			
		            }, function (response) {
						if(response.status == 401 || response.status == 403){
							//session过期
							this.$router.push({ path: 'login'})
						}
						else{
							alert('对不起，操作失败，请重新请求！');
						}
		            })
			       
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消'
		          });          
		        });
		    },
		    
		    //下广告位
		    unPromoteGoods(id){
		    		this.$confirm('是否将该商品移出广告位?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	this.$http.put('api/admin/item/'+id, {'index':1}, {emulateJSON: true}).then(function (response) {
		          		if(response.data.code=='000000'){
		          			 this.$message({
					          message: '已成功移出广告位',
					          type: 'success'
					        });
					        this.itemInfoRequest(this.curPage)
		          		}
		            			
		            }, function (response) {
						if(response.status == 401 || response.status == 403){
							//session过期
							this.$router.push({ path: 'login'})
						}
						else{
							alert('对不起，移出失败，请重新请求！');
						}
		            })
			       
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消'
		          });          
		        });
		    },
		    
		    //获取商品列表
		    itemInfoRequest(oPage){
			    	var self = this;
			    	this.tableLoading = true;
            		self.$http.get('api/admin/items?pageNum='+oPage+'&perPage=10', {}, {emulateJSON: true}).then(function (response) {
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
			    	this.itemInfoRequest(val)
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