import Cookies from 'js-cookie';
import store from '@/store';
import {
    MessageBox
} from 'element-ui';
const TokenKey = 'access-token';
const RefreshTokenKey = 'refresh-token';

export function getToken() {
    return Cookies.get(TokenKey);
}

export function getRefreshToken() {
    return Cookies.get(RefreshTokenKey);
}

export function setToken(token) {
    return Cookies.set(TokenKey, token);
}

export function setRefreshToken(token) {
    return Cookies.set(RefreshTokenKey, token);
}

export function removeToken() {
    Cookies.remove(TokenKey);
    Cookies.remove(RefreshTokenKey);
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
