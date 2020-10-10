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
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: '蜂窝后台管理系统',
            component: () => import('@/views/dashboard/index'),
            meta: { title: '蜂窝后台管理系统', icon: 'dashboard' }
        }]
    },

    {
        path: '/merchant',
        component: Layout,
        redirect: '/merchant/table',
        name: '商家管理',
        alwaysShow: true,
        meta: { title: '商家管理', icon: 'example' },
        children: [
            {
                path: 'table',
                name: '商家列表',
                component: () => import('@/views/merchant/table/index'),
                meta: { title: '商家列表', icon: 'table' }
            }
            // ,{
            //     path: 'other',
            //     name: '商家其他',
            //     component: () => import('@/views/merchant/other/index'),
            //     meta: { title: '商家其他', icon: 'nested' }
            // }
        ]
    },
    {
        path: '/operatorCommodity',
        component: Layout,
        redirect: '/operatorCommodity/table',
        name: '商品管理',
        meta: { title: '商品管理', icon: 'example' },
        children: [
            {
                path: 'table',
                name: '商品列表',
                component: () => import('@/views/operatorCommodity/table/index'),
                meta: { title: '商品列表', icon: 'table' }
            },
            {
                path: 'demand',
                name: '商品需求',
                component: () => import('@/views/operatorCommodity/userDemand/index'),
                meta: { title: '商品需求', icon: 'table' }
            }
            // ,{
            //     path: 'other',
            //     name: '商品其他',
            //     component: () => import('@/views/operatorCommodity/other/index'),
            //     meta: { title: '商品其他', icon: 'nested' }
            // }
        ]
    },
    {
        path: '/merchantCommodity',
        component: Layout,
        redirect: '/merchantCommodity/table',
        name: '商品管理',
        meta: { title: '商品管理', icon: 'example' },
        children: [
            {
                path: 'table',
                name: '商品列表',
                component: () => import('@/views/merchantCommodity/table/index'),
                meta: { title: '商品列表', icon: 'table' }
            },
            {
                path: 'new',
                name: '商品创建',
                component: () => import('@/views/merchantCommodity/new/CommodityNew'),
                meta: { title: '商品创建', icon: 'table' }
            }
            // ,{
            //     path: 'other',
            //     name: '其他',
            //     component: () => import('@/views/merchantCommodity/other/index'),
            //     meta: { title: '其他', icon: 'nested' }
            // }
        ]
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
