import { login, adminBind, refreshToken } from '@/api/user';
import {
  getToken,
  setToken,
  removeToken,
  removeInfo,
  getRefreshToken,
  setInitLogin,
  getInitLogin,
  setAuth,
  getAuth
} from '@/utils/auth';
import { resetRouter } from '@/router';

const state = {
  token: getToken(),
  initLogin: getInitLogin(),
  expireTime: 3600,
  refreshToken: getRefreshToken(),
  name: '',
  authArr: getAuth()
};

const mutations = {
  SET_TOKEN: (state, { token, refreshToken }) => {
    state.token = token;
    if (refreshToken) {
      state.refreshToken = refreshToken;
    }
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_INIT_LOGIN: (state, initLogin) => {
    state.initLogin = initLogin.toString();
  },
  SET_EXPIRE_TIME: (state, expireTime) => {
    state.expireTime = expireTime;
  },
  SET_AUTH: (state, data) => {
    state.authArr = data.split(',');
  },
  CLEAR: state => {
    state.token = '';
    state.name = '';
    state.initLogin = false;
    state.refreshToken = '';
    state.authArr = [];
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phone, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ phone: phone.trim(), password: password })
        .then(response => {
          const { data = {}} = response;
          const { token, initLogin, expireTime, roles } = data;
          commit('SET_TOKEN', { token });
          commit('SET_INIT_LOGIN', initLogin);
          commit('SET_EXPIRE_TIME', expireTime);
          commit('SET_AUTH', roles);
          setToken(token);
          setAuth(roles);
          setInitLogin(initLogin);
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
        commit('CLEAR');
        removeInfo();
        resetRouter();
        resolve();
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
  },
  adminInitBind({ commit, data }) {
    new Promise((resolve, reject) => {
      adminBind(data)
      .then(res => {
        commit('SET_INIT_LOGIN', false);
        setInitLogin(false);
        resolve();
      }).catch((error) => {
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
