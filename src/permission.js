import router from './router';
// import store from './store';
// import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';
import store from '@/store';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/login', '/updatePass', '/forgetPass']; // no redirect whitelist
const SinglePage = ['/introduce', '/register', '/userAgre', '/download'];
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
    if (hasToken) {
        if (store.state.user.initLogin === 'true') {
            NProgress.done();
            to.path === '/updatePass' ? next() : next({ path: '/updatePass' });
        } else if (whiteList.includes(to.path)) {
            NProgress.done();
            next({ path: '/' });
        } else {
            next();
        }
    } else {
        /* has no token*/
        if (to.path === '/login' || to.path === '/forgetPass') {
            // in the free login whitelist, go directly
            next();
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`);
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
