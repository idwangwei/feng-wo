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
