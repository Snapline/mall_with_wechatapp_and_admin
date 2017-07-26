<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
	    	<template v-for="item in permissionRoutes">
	    		<el-submenu :index="item.linkIndex">
			        <template slot="title">{{item.title}}</template>
				        <template v-for="child in item.children">
				          <el-menu-item :index="child.linkIndex">{{child.title}}</el-menu-item>
				        </template>
			    </el-submenu>
			    
	        </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
    	data(){
    		return{
    			permissionRoutes:[{
    				title: '商品管理',
    				linkIndex: 'goodsadmin',
    				children:[{
    					title: '商品列表',
    					linkIndex: 'goodslist',
    				},{
    				
    					title: '商品分类',
    					linkIndex: 'category',
    				}]
    			},{
    				title: '订单管理',
    				linkIndex: 'orderadmin',
    				children:[{
    					title: '订单列表',
    					linkIndex: 'orderlist',
    				}]
    			},{
    				title: '评论管理',
    				linkIndex: 'commentadmin',
    				children:[{
    					title: '评论列表',
    					linkIndex: 'commentlist',
    				}]
    			},{
    				title: '运费管理',
    				linkIndex: 'freightadmin',
    				children:[{
    					title: '运费列表',
    					linkIndex: 'freightlist',
    				}]
    			},{
    				title: '系统设置',
    				linkIndex: 'settings',
    				children:[{
    					title: '修改密码',
    					linkIndex: 'changepwd',
    				}]
    			}]
    		}
    	},
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>