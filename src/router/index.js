import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/',
        redirect: '/manager/login',
        hidden: true
    },
    {
        path: '/manager',
        redirect: '/manager/login',
        hidden: true
    },
    {
        path: '/manager/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/register',
        component: () => import('@/views/login/register'),
        meta: { title: '新用户注册' },
        hidden: true
    },
    {
        path: '/introduce',
        component: () => import('@/views/login/introduce'),
        meta: { title: '蜂窝简介' },
        hidden: true
    },
    {
        path: '/download',
        component: () => import('@/views/login/download'),
        meta: { title: '蜂窝下载' },
        hidden: true
    },
    {
        path: '/userAgre',
        component: () => import('@/views/login/userAgre'),
        meta: { title: '用户协议' },
        hidden: true
    },
    {
        path: '/manager/updatePass',
        component: () => import('@/views/login/updatePass'),
        hidden: true
    },
    {
        path: '/manager/forgetPass',
        component: () => import('@/views/login/forgetPass'),
        hidden: true
    },

    {
        path: '/manager/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/manager/dashboard',
        component: Layout,
        redirect: '/manager/dashboard/list',
        sidebarShow: true,
        children: [{
            path: 'list',
            name: '数据概览',
            component: () => import('@/views/dashboard/index'),
            meta: { title: '数据概览', icon: 'dashboard' }
        }]
    },
    {
        path: '/manager/user',
        component: Layout,
        redirect: '/manager/user/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '用户管理',
            component: () => import('@/views/user/management/index'),
            meta: { title: '用户管理', icon: 'peoples' }
        }]
    },
    {
        path: '/manager/pool',
        component: Layout,
        redirect: '/manager/pool/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '矿池管理',
            component: () => import('@/views/pool/management/index'),
            meta: { title: '矿池管理', icon: 'shopping' }
        }]
    },
    {
        path: '/manager/wwt',
        component: Layout,
        redirect: '/manager/wwt/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '市场管理',
            component: () => import('@/views/wwt/management/index'),
            meta: { title: '市场管理', icon: 'money' }
        }]
    },
    {
        path: '/manager/order',
        component: Layout,
        redirect: '/manager/order/management',
        sidebarShow: true,
        meta: { title: '订单', icon: 'clipboard' },
        children: [
            {
                path: 'management',
                name: '订单管理',
                component: () => import('@/views/order/management/index'),
                meta: { title: '订单管理', icon: 'form' }
            },
            {
                path: 'buy',
                name: '买单管理',
                component: () => import('@/views/order/management/buyOrder'),
                meta: { title: '买单管理', icon: 'form' }
            },
            {
                path: 'complaint',
                name: '申诉管理',
                component: () => import('@/views/order/management/complaintOrder'),
                meta: { title: '申诉管理', icon: 'form' }
            }
        ]
    },
    {
        path: '/manager/notify',
        component: Layout,
        redirect: '/manager/notify/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '公告管理',
            component: () => import('@/views/notify/management/index'),
            meta: { title: '公告管理', icon: 'message' }
        }]
    },
    {
        path: '/manager/feedback',
        component: Layout,
        redirect: '/manager/feedback/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '用户反馈管理',
            component: () => import('@/views/feedback/management/index'),
            meta: { title: '用户反馈管理', icon: 'form' }
        }]
    },
    {
        path: '/manager/role',
        component: Layout,
        redirect: '/manager/role/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '角色管理',
            component: () => import('@/views/role/management/index'),
            meta: { title: '角色管理', icon: 'user' }
        }]
    },
    {
        path: '/manager/talent',
        component: Layout,
        redirect: '/manager/talent/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '达人管理',
            component: () => import('@/views/talent/management/index'),
            meta: { title: '达人管理', icon: 'people' }
        }]
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/manager/404', hidden: true }
];

const createRouter = () => new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
