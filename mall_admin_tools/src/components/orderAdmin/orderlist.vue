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
		  	订单列表
		  	
		  	</div>
		  </el-col>
		</el-row>
		
		<!--发货弹窗-->
		<el-dialog title="商品发货信息" v-model="sendGoodsVisible" size="small">
			<el-form ref="deliverForm" :model="deliverForm" label-width="100px">
				 <el-form-item label="商品订单">
				      <span>{{chosenOrder}}</span>
				  </el-form-item>
				  <el-form-item label="快递公司" prop="deliverName">
				      <el-select v-model="deliverForm.deliverName" placeholder="请选择">
					    <el-option
					      v-for="item in deliverList"
					      :label="item.name"
					      :value="item.name">
					    </el-option>
					  </el-select>
				  </el-form-item>
				  <el-form-item label="快递单号"  prop="deliverNo"
				  :rules="[{ required: true, message: '单号不能为空'}]">
				      <el-input v-model="deliverForm.deliverNo" placeholder="请输入快递单号" style="width:200px;"></el-input>
				  </el-form-item>
				   <el-form-item>
				      <el-button type="success" @click="submitDeliver('deliverForm')">提交</el-button>
				  </el-form-item>
			</el-form>
		   
		</el-dialog>
		
		<!--用户列表-->
		<el-table
		    :data="tableData"
		    stripe
		    style="width: 100%">
		    <el-table-column
		      prop="orderId"
		      label="订单号"
		      min-width="130">
		    </el-table-column>
		    
		    <el-table-column
		    	  prop="user_name"
		    	  label="买家名"
		    	  min-width="100">
		    </el-table-column>
		    
		    <el-table-column
		      prop="address"
		      label="地址"
		      min-width="150">
		    </el-table-column>
		    
		    <el-table-column
		      prop="status"
		      label="状态"
		      min-width="60">
		    </el-table-column>
		    
		    <el-table-column
		      prop="totalPrice"
		      label="金额"
		      min-width="80">
		    </el-table-column>
		    
		     <el-table-column
		      prop="totalPrice"
		      label="快递单号"
		      min-width="130">
		       <template scope="scope">
		        <span>{{scope.row.expressId==''?'暂未发货':scope.row.expressId}}</span>
		      </template>
		    </el-table-column>
		    
		    <el-table-column
		      prop="timeBegin"
		      label="日期"
		      min-width="130">
		    </el-table-column>
		    
		     <el-table-column
		      label="操作"
		      min-width="160">
		      <template scope="scope">
		        <el-button @click="sendGoods(scope.row.orderId)" type="warning" size="small">发货</el-button>
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
		        	sendGoodsVisible: false,
		        	chosenOrder: '',
		        	deliverForm:{
		        		'deliverName': '顺丰',
		        		'deliverNo': ''
		        	},
		        	tableData:[], //表格数据
		        	
		        	//快递公司数组
		        	deliverList:[{
		        		'name': '顺丰'
		        	},{
		        		'name': '申通'
		        	},{
		        		'name': '圆通速递'
		        	},{
		        		'name': '中通速递'
		        	},{
		        		'name': '百世汇通'
		        	},{
		        		'name': '韵达快运'
		        	},{
		        		'name': '天天快递'
		        	}]
	      	};
	    },
	    created(){
	    		this.orderInfoRequest(1);
	    },
	    methods:{
		    	//弹出发货
		    	sendGoods(orderid){
		    		this.sendGoodsVisible = true;
		    		this.chosenOrder = orderid;
		    	},
		    	//发货按钮
		    	submitDeliver(formName){
		    		 this.$refs[formName].validate((valid) => {
		    		 	if(valid){
		    		 		this.$http.put('api/admin/order/'+this.chosenOrder, {'expressId':this.deliverForm.deliverNo, 'expressCompany':this.deliverForm.deliverName}, {emulateJSON: true}).then(function (response) {
	              			if(response.data.code=='000000'){
	              				this.$message({
						          message: '快递信息添加成功',
						          type: 'success'
						        });
						        this.sendGoodsVisible = false;
	              			}
	              			else{
	              				this.$message.error(response.data.msg);
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
		    		 	}
			    		else{
			    		 	return false
			    		}
		    		 })
		    	},
		    //获取
		    orderInfoRequest(oPage){
	            	this.$http.get('api/admin/orders?perPage=10&pageNum='+this.curPage, {}, {emulateJSON: true}).then(function (response) {
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
			    	this.orderInfoRequest(val)
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