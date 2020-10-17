import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/bms/common/login',
    method: 'post',
    data
  });
}
export function getSmsCode(data) {
  return request({
    url: '/bms/common/sms',
    method: 'post',
    data
  });
}
export function updatePass(data) {
  return request({
    url: '/bms/common/updatePwd',
    method: 'put',
    data
  });
}
export function adminBind(data) {
  return request({
    url: '/bms/adminuser/binding',
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
