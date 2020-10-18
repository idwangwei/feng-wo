import request from '@/utils/request';

export function getUserList(data) {
  return request({
    url: '/bms/user/list',
    method: 'post',
    data
  });
}

export function modifyUserInfo(data) {
  return request({
    url: '/bms/user',
    method: 'put',
    data
  });
}

export function getPoolList(data) {
  return request({
    url: '/bms/mining/list',
    method: 'post',
    data
  });
}
export function switchPoolEnableStatus(data) {
  return request({
    url: '/bms/mining/enable',
    method: 'post',
    data
  });
}
export function updatePoolInfo(data) {
  return request({
    url: '/bms/mining/update',
    method: 'post',
    data
  });
}
export function getWWTPrice(data) {
  return request({
    url: '/bms/price',
    method: 'post',
    data
  });
}
export function getPriceList() {
  return request({
    url: '/bms/price/list',
    method: 'get'
  });
}
export function updateWWTPrice(data) {
  return request({
    url: '/bms/price',
    method: 'put',
    data
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
export function getFeedbackList() {
  return request({
    url: '/bms/feedback/list',
    method: 'post'
  });
}
export function getFeedbackReplyList() {
  return request({
    url: '/bms/feedback/replyfeedbacks',
    method: 'post'
  });
}
export function getHomeData() {
  return request({
    url: '/bms/common/home',
    method: 'post'
  });
}
