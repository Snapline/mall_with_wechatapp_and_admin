<template>
	<div>
		<el-breadcrumb separator="/">
		  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>运费列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--新建栏-->
		<el-row style="margin-bottom:30px; margin-top:30px;">
		  <el-col :span="24">
		  	<div class="grid-content bg-purple-dark">
		  	运费列表
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
		      prop="province"
		      label="省份">
		    </el-table-column>
		    <el-table-column
		      prop="price"
		      label="运费">
		      <template scope="scope">
		        <span>{{scope.row.price}}元</span>
		      </template>
		    </el-table-column>
		     <el-table-column
		      label="操作"
		      min-width="180">
		      <template scope="scope">
		        <el-button @click="editFreight(scope.row.province)" type="info" size="small">修改运费</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
			
	</div>
</template>

<script>
	export default {
	    data() {
	    	
		    	return {
		    		tableLoading: true,
		        	tableData:[] //表格数据
		        	
		     };
	    },
	    created(){
	    		this.freightInfoRequest();
	    },
	    methods:{
		    //修改
		    editFreight(province){
		    	var _this = this;
		    	this.$prompt('修改'+province+'地区的运费', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          inputPattern: /^\d+$/,
		          inputErrorMessage: '请输入数字'
		        }).then(({ value }) => {
		          	_this.$http.put('api/admin/express_price', {'province':province, 'price':value}, {emulateJSON: true}).then(function (response) {
	        			if(response.data.code='000000'){
	        				_this.$message({
					          message: '运费修改成功',
					          type: 'success'
					        });
					        _this.freightInfoRequest();
	        			}
	        			else{
	        				_this.$message.error('运费修改失败，请重试');
	        			}
		            }, function (response) {
						if(response.status == 401 || response.status == 403){
							//session过期
							this.$router.push({ path: 'login'})
						}
						else{
							alert('对不起，请求错误，请重新请求哦！');
						}
						
		            })
		        }).catch(() => {      
		        });
		    	
		    },
		    
		    
		    //获取商品列表
		    freightInfoRequest(oPage){
			    	var self = this;
			    	this.tableLoading = true;
            		self.$http.get('api/admin/express_price', {}, {emulateJSON: true}).then(function (response) {
		        			this.tableLoading = false;
		          			this.tableData = response.data.data;
		            }, function (response) {
						if(response.status == 401 || response.status == 403){
							//session过期
							this.$router.push({ path: 'login'})
						}
						else{
							alert('对不起，请求错误，请重新请求哦！');
						}
						
		            })
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