import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/api/v1/manager/merchant/getList',
    method: 'get',
    params
  });
}

export function getDetail(params) {
  return request({
    url: '/api/v1/manager/merchant/getDetail',
    method: 'get',
    params
  });
}
export function banner(data) {
  return request({
    url: '/api/v1/manager/merchant/banner',
    method: 'post',
    data
  });
}
export function pass(data) {
  return request({
    url: '/api/v1/manager/merchant/pass',
    method: 'post',
    data
  });
}
export function refuse(data) {
  return request({
    url: '/api/v1/manager/merchant/refuse',
    method: 'post',
    data
  });
}
