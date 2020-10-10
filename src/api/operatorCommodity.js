import request from '@/utils/request';

export function getMaxConnectionList(params) {
    return request({
        url: '/api/v1/manager/commodity/getMaxConnectionList',
        method: 'get',
        params
    });
}
export function getMaxInterestList(params) {
    return request({
        url: '/api/v1/manager/commodity/getMaxInterestList',
        method: 'get',
        params
    });
}
export function getListByMerchantId(params) {
    return request({
        url: '/api/v1/manager/commodity/getCommodityList',
        method: 'get',
        params: { role: 'OPERATOR', ...params }
    });
}
export function getDetailByManager(params) {
    return request({
        url: '/api/v1/manager/commodity/getCommodityDetail',
        method: 'get',
        params
    });
}
export function refused(data) {
    return request({
        url: '/api/v1/manager/commodity/refusedCommodity',
        method: 'post',
        data
    });
}
export function pass(data) {
    return request({
        url: '/api/v1/manager/commodity/passCommodity',
        method: 'post',
        data
    });
}

export function soldOut(data) {
    return request({
        url: '/api/v1/manager/commodity/soldOutCommodity',
        method: 'post',
        data
    });
}
export function getMerchantListByName(params) {
    return request({
        url: '/api/v1/manager/merchant/getListByName',
        method: 'get',
        params
    });
}
export function getDemandList(params) {
    return request({
        url: '/api/v1/manager/customer/getDemandList',
        method: 'get',
        params: { ...params, role: 'OPERATOR' }
    });
}
