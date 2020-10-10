import request from '@/utils/request';

export function getCommodityStatusList(params) {
    return request({
        url: '/open/commodity/getCommodityStatusList',
        method: 'get',
        params
    });
}
export function getCarTypeList(params) {
    return request({
        url: '/open/commodity/getCarTypeList',
        method: 'get',
        params
    });
}
export function getCommodityBrandList(params) {
    return request({
        url: '/open/commodity/getBrandDetailList',
        method: 'get',
        params
    });
}
export function getCommodityDecorativeList(params) {
    return request({
        url: '/open/commodity/getCommodityDecorativeList',
        method: 'get',
        params
    });
}
export function getCommoditySpecificationList(params) {
    return request({
        url: '/open/commodity/getCommoditySpecificationList',
        method: 'get',
        params
    });
}
