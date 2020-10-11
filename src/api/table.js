import request from '@/utils/request';

export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'post',
    params
  });
}
export function getPoolList(params) {
  return request({
    url: '/pool/list',
    method: 'post',
    params
  });
}
export function getRoles() {
  return request({
    url: '/role/list',
    method: 'get'
  });
}
export function getManegements() {
  return request({
    url: '/manegement/list',
    method: 'get'
  });
}
