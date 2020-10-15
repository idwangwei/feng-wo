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
export function getOrderList() {
  return request({
    url: '/bms/market/list',
    method: 'post'
  });
}
export function getNotifyList() {
  return request({
    url: '/bms/ann/list',
    method: 'post'
  });
}
