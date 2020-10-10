
import request from '@/utils/request';

export function getStatusList() {
  return request({
    url: '/api/v1/manager/merchant/getStatusList',
    method: 'get'
  });
}
