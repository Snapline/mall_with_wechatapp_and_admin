import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import vueResource from 'vue-resource';
Vue.use(vueResource);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        //商品管理
        //商品列表
         {
            path: '/goodslist',
            component: resolve => require(['../components/home.vue'], resolve),
            children:[
            	{
            		path: '/',
            		component: resolve => require(['../components/goodsAdmin/goodslist.vue'], resolve)
            	}
            ]
        },
        //商品分类
        {
            path: '/category',
            component: resolve => require(['../components/home.vue'], resolve),
            children:[
            	{
            		path: '/',
            		component: resolve => require(['../components/goodsAdmin/category.vue'], resolve)
            	}
            ]
        },
        //添加分类
        {
            path: '/addcategory',
            component: resolve => require(['../components/home.vue'], resolve),
            children:[
            	{
            		path: '/',
            		component: resolve => require(['../components/goodsAdmin/addCate.vue'], resolve)
            	}
            ]
        },
        //修改分类
        {
            path: '/editcategory',
            component: resolve => require(['../components/home.vue'], resolve),
            children:[
            	{
            		path: '/',
            		component: resolve => require(['../components/goodsAdmin/editCate.vue'], resolve)
            	}
            ]
        },
        //添加商品
         {
            path: '/addgoods',
            component: resolve => require(['../components/home.vue'], resolve),
            children:[
            	{
            		path: '/',
            		component: resolve => require(['../components/goodsAdmin/addgoods.vue'], resolve)
            	}
            ]
        },
        //修改商品
         {
            path: '/editgoods',
            component: resolve => require(['../components/home.vue'], resolve),
            children:[
            	{
            		path: '/',
            		component: resolve => require(['../components/goodsAdmin/editgoods.vue'], resolve)
            	}
            ]
        },
        
         //订单管理
         //订单列表
         {
            path: '/orderlist',
            component: resolve => require(['../components/home.vue'], resolve),
            children:[
            	{
            		path: '/',
            		component: resolve => require(['../components/orderAdmin/orderlist.vue'], resolve)
            	}
            ]
        },
        
        //评论管理
         //评论列表
         {
            path: '/commentlist',
            component: resolve => require(['../components/home.vue'], resolve),
            children:[
            	{
            		path: '/',
            		component: resolve => require(['../components/commentAdmin/comment.vue'], resolve)
            	}
            ]
        },
          //运费管理
         //运费列表
         {
            path: '/freightlist',
            component: resolve => require(['../components/home.vue'], resolve),
            children:[
            	{
            		path: '/',
            		component: resolve => require(['../components/freightAdmin/freightlist.vue'], resolve)
            	}
            ]
        },
        
         //系统设置
         //修改密码
         {
            path: '/changepwd',
            component: resolve => require(['../components/home.vue'], resolve),
            children:[
            	{
            		path: '/',
            		component: resolve => require(['../components/settings/settings.vue'], resolve)
            	}
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/login.vue'], resolve)
        }
    ]
})