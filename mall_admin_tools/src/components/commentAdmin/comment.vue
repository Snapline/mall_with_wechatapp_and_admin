<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>评论列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--新建栏-->
		<el-row style="margin-bottom:30px; margin-top:30px;">
		  <el-col :span="24">
		  	<div class="grid-content bg-purple-dark">
		  	评论列表
		  	
		  	</div>
		  </el-col>
		</el-row>
		
		<!--用户列表-->
		<el-table
		    :data="tableData"
		    stripe
		    style="width: 100%">
		    <el-table-column
		      prop="addtime"
		      label="评价时间"
		      min-width="200">
		    </el-table-column>
		    
		    <el-table-column
		      prop="item_name"
		      label="商品名称"
		      min-width="130">
		    </el-table-column>
		    
		    <el-table-column
	    	  prop="user_name"
	    	  label="买家名"
	    	  min-width="100">
		    </el-table-column>
		    
		    <el-table-column
		      prop="买家打分"
		      label="地址"
		      min-width="180">
		      <template scope="scope">
		        <span>{{scope.row.stars}}星</span>
		      </template>
		    </el-table-column>
		    
		    <el-table-column
		      prop="comment"
		      label="评论内容"
		      min-width="250">
		    </el-table-column>
		    
		    <el-table-column
		      prop="reply"
		      label="商家回复"
		      min-width="200">
		      <template scope="scope">
		        <span v-if="scope.row.reply==''">暂未回复</span>
		        <span v-else>{{scope.row.reply}}</span>
		      </template>
		    </el-table-column>
		    
		     <el-table-column
		      label="操作"
		      min-width="100">
		      <template scope="scope">
		        <el-button @click="replyComment(scope.row.id, scope.row.item_name, scope.row.user_name)" type="warning" size="small">回复</el-button>
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
		        	sendGoodsVisible: false,
		        	chosenOrder: '',
		        	tableData:[], //表格数据
		        	
	      	};
	    },
	    created(){
	    		this.commentInfoRequest();
	    },
	    methods:{
	    	//弹出回复
	    	replyComment(id, itemName, userName){
	    		var _this = this;
	    		this.$prompt('回复客户    '+userName+'    关于商品    '+itemName+'    的评论', '回复评论', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消'
		        }).then(({ value }) => {
		          _this.$http.put('api/admin/comment', {'id':id, 'reply':value}, {emulateJSON: true}).then(function (response) {
              			if(response.data.code=='000000'){
              				this.$message({
					          message: '回复成功',
					          type: 'success'
					        });
					        this.commentInfoRequest()
              			}
              			else{
              				this.$message.error(response.data.msg);
              			}
              		 })
		        }).catch(() => {
		                 
		        });
	    	},
		    //获取
		    commentInfoRequest(){
	            	this.$http.get('api/admin/comment?perPage=10&pageNum='+this.curPage, {}, {emulateJSON: true}).then(function (response) {
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
			    	this.commentInfoRequest()
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