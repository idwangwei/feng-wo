import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['access-token'] = getToken();
    }
    // requestQueue.push({ url: config });
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: `code:${res.code} message:${res.message || 'Error'}`,
        type: 'error',
        duration: 5 * 1000
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 21013) {
        // to re-login
        MessageBox.alert(
          '登录过期, 重新登录',
          '提示',
          {
            confirmButtonText: '重登',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/logout').then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    const { response = {}} = error;
    const { data = {}} = response;
    if (data.code === 21011 || data.code === 21012) {
      store.dispatch('user/refreshToken').then(() => {
        // requestQueue.forEach(item => {});
      });
      Promise.reject(error);
    } else {
      Message({
        dangerouslyUseHTMLString: true,
        message: `<p>CODE：${data.code}</p><p>MESSAGE：${data.message}</p>`,
        type: 'error',
        duration: 5 * 1000
      });
      return Promise.reject(error);
    }
  }
);
// const requestQueue = [];
// let refreshAccessTokenProcessing = false;

export default service;
