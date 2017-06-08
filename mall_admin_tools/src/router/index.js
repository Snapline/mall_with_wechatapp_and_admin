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
        //充值业务请款
//      {
//          path: '/cashout',
//          component: resolve => require(['../components/home.vue'], resolve),
//          children:[
//          	{
//          		path: '/',
//          		component: resolve => require(['../components/charge/cashout.vue'], resolve)
//          	}
//          ]
//      },
//      //供应商列表
//      {
//          path: '/supplylist',
//          component: resolve => require(['../components/home.vue'], resolve),
//          children:[
//          	{
//          		path: '/',
//          		component: resolve => require(['../components/supply/supplytable.vue'], resolve)
//          	}
//          ]
//      },
//      {
//          path: '/newsupply',
//          component: resolve => require(['../components/home.vue'], resolve),
//          children:[
//          	{
//          		path: '/',
//          		component: resolve => require(['../components/supply/newsupply.vue'], resolve)
//          	}
//          ]
//      },
//      {
//          path: '/detailsupply',
//          component: resolve => require(['../components/home.vue'], resolve),
//          children:[
//          	{
//          		path: '/',
//          		component: resolve => require(['../components/supply/detailSupply.vue'], resolve)
//          	}
//          ]
//      },
//      {
//          path: '/editsupply',
//          component: resolve => require(['../components/home.vue'], resolve),
//          children:[
//          	{
//          		path: '/',
//          		component: resolve => require(['../components/supply/editSupply.vue'], resolve)
//          	}
//          ]
//      },
//      //权限管理模块
//      {
//          path: '/userauth',
//          component: resolve => require(['../components/home.vue'], resolve),
//          children:[
//          	{
//          		path: '/',
//          		component: resolve => require(['../components/auth/userauth.vue'], resolve)
//          	}
//          ]
//      }, 
//      {
//          path: '/roleauth',
//          component: resolve => require(['../components/home.vue'], resolve),
//          children:[
//          	{
//          		path: '/',
//          		component: resolve => require(['../components/auth/roleauth.vue'], resolve)
//          	}
//          ]
//      },
        {
            path: '/login',
            component: resolve => require(['../components/login.vue'], resolve)
        }
    ]
})