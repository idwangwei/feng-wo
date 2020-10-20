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
export function getOrderList(data) {
  return request({
    url: '/bms/market/list',
    method: 'post',
    data
  });
}
export function cancelOrder(data) {
  return request({
    url: '/bms/market/canceled',
    method: 'post',
    data
  });
}
export function permitOrder(data) {
  return request({
    url: '/bms/market/permit',
    method: 'post',
    data: { language: "", ...data }
  });
}
export function getNotifyList(data) {
  return request({
    url: '/bms/ann/list',
    method: 'post',
    data
  });
}
export function deleteNotify(params) {
  return request({
    url: '/bms/ann',
    method: 'delete',
    params
  });
}
export function addNotify(data) {
  return request({
    url: '/bms/ann',
    method: 'post',
    data: { language: '', ...data }
  });
}
export function getFeedbackList(data) {
  return request({
    url: '/bms/feedback/list',
    method: 'post',
    data
  });
}
export function getFeedbackReplyList(data) {
  return request({
    url: '/bms/feedback/replyfeedbacks',
    method: 'post',
    data
  });
}
export function replyFeedback(data) {
  return request({
    url: '/bms/feedback/reply',
    method: 'post',
    data
  });
}
export function getHomeData() {
  return request({
    url: '/bms/common/home',
    method: 'post'
  });
}
export function getImg({ imageType, filename }) {
  return request({
    url: `/bms/common/images/${imageType}/${filename}`,
    method: 'get'
  });
}
