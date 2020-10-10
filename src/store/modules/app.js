import Cookies from 'js-cookie';
import { getStatusList } from '@/api/dashboard';
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  // "BANNED": "运营端封禁",
  // "AUDIT_PASS": "正常营业中",
  // "AUDIT_REFUSED": "审核拒绝",
  // "WAIT_AUDIT": "等待审核"
  merchantStatusList: []
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1);
    } else {
      Cookies.set('sidebarStatus', 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_STATUS_LIST: (state, list) => {
    state.merchantStatusList = list;
  }
};

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  },
  setStatusList({ commit }, param) {
    const statusTypeMap = {
      AUDIT_PASS: 'primary', // "正常营业中"
      AUDIT_REFUSED: 'success', // "审核拒绝"
      BANNED: 'info', // "运营端封禁"
      WAIT_AUDIT: 'warning' // "等待审核"
    };
    getStatusList().then(resp => {
      const { data } = resp;
      const list = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          list.push({ key, label: data[key], type: statusTypeMap[key] || "" });
        }
      }
      commit('SET_STATUS_LIST', list);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
