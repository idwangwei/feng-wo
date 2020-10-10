import { getCommodityStatusList, getCarTypeList, getCommodityBrandList } from '@/api/commodity';

const state = {
  commodityStatusList: [],
  commodityBrandList: [],
  carTypeList: []
};

const mutations = {
  SET_COMMODITY_STATUS_LIST: (state, list) => {
    state.commodityStatusList = list;
  },
  SET_CAR_TYPE_LIST: (state, list) => {
    state.carTypeList = list;
  },
  SET_COMMODITY_BRAND_LIST: (state, list) => {
    state.commodityBrandList = list;
  }
};

const actions = {
  getCommodityStatusList({ commit, state }) {
    const typeColorMap = {
      'NEW': 'primary',
      'WAIT_AUDIT': '',
      'SELLING': 'success',
      'AUDIT_REFUSED': 'info',
      'MERCHANT_SOLD_OUT': 'warning',
      'MANAGER_SOLD_OUT': 'danger'
    };
    return new Promise((resolve, reject) => {
      getCommodityStatusList().then(response => {
        const { data } = response;
        const list = [];
        for (const key in data) {
          list.push({ key, label: data[key], type: typeColorMap[key] || '' });
        }
        commit('SET_COMMODITY_STATUS_LIST', list);
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getCarTypeList({ commit, state }) {
    return new Promise((resolve, reject) => {
      getCarTypeList().then(response => {
        const { data } = response;
        const list = [];
        for (const key in data) {
          list.push({ key, value: data[key] });
        }
        commit('SET_CAR_TYPE_LIST', list);
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  },
  getCommodityBrandList({ commit, state }) {
    return new Promise((resolve, reject) => {
      getCommodityBrandList().then(response => {
        const { data } = response;
        commit('SET_COMMODITY_BRAND_LIST', data);
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
