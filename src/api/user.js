import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  });
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  });
}

export function refreshToken(data) {
  return request({
    url: `/security/refresh/access_token`,
    method: 'post',
    data
  });
}
