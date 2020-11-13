import router from './router';
// import store from './store';
// import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';
import store from '@/store';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/manager/login', '/manager/updatePass', '/manager/forgetPass']; // no redirect whitelist
const SinglePage = ['/introduce', '/register', '/userAgre', '/download'];
const authMap = {
    ALL: '',
    MINING_MANAGER: '/manager/pool',
    MARKET_MANAGER: '/manager/wwt',
    ORDER_MANAGER: '/manager/order',
    ANN_MANAGER: '/manager/notify',
    FEEDBACK_MANAGER: '/manager/feedback',
    USER_MANAGER: '/manager/user',
    TALENT_MANAGER: '/manager/talent',
    VOTE_MANAGER: '/manager/vote',
    ROLE_MANAGER: '/manager/role'
};
router.beforeEach((to, from, next) => {
    // start progress bar
    NProgress.start();
    // set page title
    if (SinglePage.includes(to.path)) {
        document.title = getPageTitle(to.meta.title, true);
        next();
        return;
    }
    document.title = getPageTitle(to.meta.title);
    // determine whether the user has logged in
    const hasToken = getToken();

    if ((from.path === '/' || from.path === '/manager') && to.path === '/manager/login') {
        store.dispatch('user/logout');
        NProgress.done();
        next();
        return;
    }

    if (hasToken) {
        if (store.state.user.initLogin === 'true') {
            NProgress.done();
            if (to.path === '/manager/login') {
                next();
                return;
            }
            to.path === '/manager/updatePass' ? next() : next({ path: '/manager/updatePass' });
        } else if (whiteList.includes(to.path)) {
            NProgress.done();
            next({ path: '/manager/dashboard' });
        } else {
            console.log(store.state.user.authArr);
            try {
                if (store.state.user.authArr.find(au => to.path.indexOf(authMap[au]) !== -1) || to.path.indexOf('dashboard') !== -1) {
                    next();
                } else {
                    next({ path: '/manager/dashboard' });
                }
            } catch (err) {
                console.log(err);
            }
        }
    } else {
        /* has no token*/
        if (to.path === '/manager/login' || to.path === '/manager/forgetPass') {
            // in the free login whitelist, go directly
            next();
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/manager/login?redirect=${to.path}`);
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
