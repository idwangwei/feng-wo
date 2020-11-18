import Cookies from 'js-cookie';
import { getPubkey } from '@/api/user';
import { getPubKey, setPubKey } from '@/utils/auth';
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  pubkey: getPubKey()
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
  SET_PUBKEY: (state, key) => {
    state.pubkey = key;
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
  getKey({ commit }) {
    return new Promise((resolve, reject) => {
      getPubkey().then(response => {
        commit('SET_PUBKEY', response);
        setPubKey(response);
      })
      .catch(error => {
        commit('SET_PUBKEY', 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQbjqqLnTyLsIs8ieC9rT6iqpwEO31fZtVlhc7QAE68K/nrne5ZTgWCyU9CyCDIX7EvUzzDtEm0TDZn7ZoznVKUliQ15yMJbO9umv+MCY+Xux3IWS96HGk95DYZ9x7hXkKaqD8D9xRjXtpXzoyb7cE9MiiJaCQ5xtVMJk38xWZxQIDAQAB');
        setPubKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQbjqqLnTyLsIs8ieC9rT6iqpwEO31fZtVlhc7QAE68K/nrne5ZTgWCyU9CyCDIX7EvUzzDtEm0TDZn7ZoznVKUliQ15yMJbO9umv+MCY+Xux3IWS96HGk95DYZ9x7hXkKaqD8D9xRjXtpXzoyb7cE9MiiJaCQ5xtVMJk38xWZxQIDAQAB');
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
