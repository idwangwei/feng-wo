import request from '@/utils/request';

export function getList(params) {
    return request({
        url: '/api/v1/merchant/commodity/getCommodityList',
        method: 'get',
        params
    });
}
export function soldOut(data) {
    return request({
        url: '/api/v1/merchant/commodity/soldOutCommodity',
        method: 'post',
        data
    });
}
export function putAway(data) {
    return request({
        url: '/api/v1/merchant/commodity/putawayCommodity',
        method: 'post',
        data
    });
}
export function add(data) {
    return request({
        // url: '/api/v1/merchant/commodity/addCommodity',
        url: '/api/v1/merchant/commodity/addSpecificationCommodity',
        method: 'post',
        data
    });
}
export function getDetail(params) {
    return request({
        url: '/api/v1/merchant/commodity/getCommodityDetail',
        method: 'get',
        params
    });
}
export function modify(data) {
    return request({
        url: '/api/v1/merchant/commodity/modifyCommodity',
        method: 'post',
        data
    });
}
