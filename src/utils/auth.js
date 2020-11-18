import Cookies from 'js-cookie';
import store from '@/store';
import {
    MessageBox
} from 'element-ui';
const TokenKey = 'access-token';
const RefreshTokenKey = 'refresh-token';
const InitLogin = 'init-login';
const authRoles = 'auth-roles';
const pubKey = 'pub-key';

export function getToken() {
    return Cookies.get(TokenKey);
}

export function getRefreshToken() {
    return Cookies.get(RefreshTokenKey);
}

export function setToken(token) {
    console.log('setToke====');
    return Cookies.set(TokenKey, token);
}

export function removeToken() {
    console.log('removeToken====');
    Cookies.remove(TokenKey);
}
export function setRefreshToken(token) {
    return Cookies.set(RefreshTokenKey, token);
}
export function setInitLogin(status) {
    return Cookies.set(InitLogin, status);
}
export function getInitLogin() {
    return Cookies.get(InitLogin);
}
export function setAuth(data) {
    return Cookies.set(authRoles, data);
}
export function getAuth() {
    const str = Cookies.get(authRoles);
    return str ? str.split(',') : [];
}
export function setPubKey(data) {
    console.log('setPubKey====');

    return Cookies.set(pubKey, data);
}
export function getPubKey() {
    return Cookies.get(pubKey);
}

export function removeInfo() {
    console.log('removeToken====');
    console.log('remove pubKey====');

    Cookies.remove(authRoles);
    Cookies.remove(TokenKey);
    Cookies.remove(RefreshTokenKey);
    Cookies.remove(InitLogin);
    Cookies.remove(pubKey);
}

export function checkPermission(value) {
    const { user } = store.state;
    return !!user;
}
export function showPermissionMessage(value) {
    const { info } = store.state.user;
    MessageBox({
        title: '提示',
        message: `账号${info.statusDesc}, 操作失败`,
        type: 'warning'
    });
}
