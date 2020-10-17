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
