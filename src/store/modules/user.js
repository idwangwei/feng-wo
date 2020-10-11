import { login, logout, refreshToken } from '@/api/user';
import {
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken
} from '@/utils/auth';
import { resetRouter } from '@/router';

const state = {
  token: getToken(),
  refreshToken: getRefreshToken(),
  name: ''
};

const mutations = {
  SET_TOKEN: (state, { accessToken, refreshToken }) => {
    debugger;
    state.token = accessToken;
    if (refreshToken) {
      state.refreshToken = refreshToken;
    }
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  CLEAR: state => {
    state.token = '';
    state.name = '';
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, role } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, role })
        .then(response => {
          const { data = {}} = response;
          const { accessToken, refreshToken } = data;
          commit('SET_TOKEN', { accessToken, refreshToken });
          setToken(accessToken);
          setRefreshToken(refreshToken);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(response => {
        commit('CLEAR');
        removeToken();
        resetRouter();
        resolve();
      })
      .catch(error => {
        reject(error);
      });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', {});
      removeToken();
      resolve();
    });
  },

  refreshToken({ commit, state }) {
    return new Promise(resolve => {
      refreshToken({ refreshToken: state.refreshToken }).then(response => {
        const { data } = response;
        commit('SET_TOKEN', { accessToken: data.accessToken });
        setToken(data.accessToken);
        resolve();
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
