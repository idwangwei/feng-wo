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
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/register',
        component: () => import('@/views/login/updatePass'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        sidebarShow: true,
        children: [{
            path: 'dashboard',
            name: '数据概览',
            component: () => import('@/views/dashboard/index'),
            meta: { title: '数据概览', icon: 'dashboard' }
        }]
    },
    {
        path: '/user',
        component: Layout,
        redirect: '/user/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '用户管理',
            component: () => import('@/views/user/management/index'),
            meta: { title: '用户管理', icon: 'peoples' }
        }]
    },
    {
        path: '/pool',
        component: Layout,
        redirect: '/pool/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '矿池管理',
            component: () => import('@/views/pool/management/index'),
            meta: { title: '矿池管理', icon: 'shopping' }
        }]
    },
    {
        path: '/wwt',
        component: Layout,
        redirect: '/wwt/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: 'FMC价格管理',
            component: () => import('@/views/wwt/management/index'),
            meta: { title: 'FMC价格管理', icon: 'money' }
        }]
    },
    {
        path: '/order',
        component: Layout,
        redirect: '/order/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '订单管理',
            component: () => import('@/views/order/management/index'),
            meta: { title: '订单管理', icon: 'clipboard' }
        }]
    },
    {
        path: '/notify',
        component: Layout,
        redirect: '/notify/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '公告管理',
            component: () => import('@/views/notify/management/index'),
            meta: { title: '公告管理', icon: 'message' }
        }]
    },
    {
        path: '/feedback',
        component: Layout,
        redirect: '/feedback/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '用户反馈管理',
            component: () => import('@/views/feedback/management/index'),
            meta: { title: '用户反馈管理', icon: 'form' }
        }]
    },
    {
        path: '/role',
        component: Layout,
        redirect: '/role/management',
        sidebarShow: true,
        children: [{
            path: 'management',
            name: '角色管理',
            component: () => import('@/views/role/management/index'),
            meta: { title: '角色管理', icon: 'user' }
        }]
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new Router({
    // mode: 'history', // require service support
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
