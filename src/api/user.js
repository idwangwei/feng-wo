import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/security/login/web',
    method: 'post',
    data
  });
}

export function getInfo(role) {
  return request({
    url: '/api/v1/merchant/account/getDetail',
    method: 'get',
    params: {
      role: role
    }
  });
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  });
}

export function getSysCode(data) {
  return request({
    url: `/open/merchant/account/sendSmsCode`,
    method: 'post',
    data
  });
}

export function register(data) {
  return request({
    url: `/open/merchant/account/register`,
    method: 'post',
    data
  });
}
export function refreshToken(data) {
  return request({
    url: `/security/refresh/access_token`,
    method: 'post',
    data
  });
}
