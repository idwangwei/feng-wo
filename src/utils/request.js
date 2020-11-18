import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import JsEncrypt from 'jsencrypt';
window.JsEncrypt = JsEncrypt;

const encruption = (key, obj) => {
  if (!obj) {
    return null;
  }
  const encrypt = new JsEncrypt();
  encrypt.setPublicKey(key);
  encrypt.encryptLong = function(string) {
    const k = this;
    const maxLength = (((k.key.n.bitLength() + 7) >> 3) - 11);
    try {
        let subStr = ""; let encryptedString = "";
        let subStart = 0;
        let bitLen = 0;
        const len = string.length;
        for (var i = 0; i < len; i++) {
            // js 是使用 Unicode 编码的，每个字符所占用的字节数不同
            const charCode = string.charCodeAt(i);
            // if(i >= 218 && i<= 275)
            //     console.log(i, charCode.toString(16), string[i])
            let increment = 0;
            if (charCode <= 0x007f) {
                increment = 1;
            } else if (charCode <= 0x07ff) {
                increment = 2;
            } else if (charCode <= 0xffff) {
                increment = 3;
            } else {
                increment = 4;
            }
            bitLen += increment;

            // 字节数到达上限，获取子字符串加密并追加到总字符串后。更新下一个字符串起始位置及字节计算。
            if (bitLen > maxLength) {
              debugger;
                // 本位字符加上会过长，回到上一位
                subStr = string.substring(subStart, i);
                console.log(subStart, i, subStr);
                const t = k.encrypt(subStr);
                // console.log(t)
                encryptedString += t;
                // substring第i位不会被取到。-1是因为进入下次循环时，i+1导致上一位被忽略，得回去把它带上
                subStart = i--;
                bitLen = 0;
            }
        }
        subStr = string.substring(subStart, len);
        console.log(subStr);
        encryptedString += k.encrypt(subStr);
        return encryptedString;
        // return hex2b64(encryptedString);
    } catch (ex) {
      return false;
    }
  };
  let paramsData = ''; // 加密后的参数
  let paramsString = ''; // 把传过来的data数据转成字符串
  paramsString = JSON.stringify(obj);
  console.log(paramsString.length, paramsString);
  paramsData = encrypt.encryptLong(paramsString);
  return JSON.stringify({ body: paramsData });
};

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
      config.headers['Authorization'] = store.getters.token;
    }
    // requestQueue.push({ url: config });

    // 注册接口在8001端口，其他接口在8080
    const url = config.url.replace(config.baseURL, '');
    if (url === '/auth/register') {
      config.baseURL = process.env.VUE_APP_BASE_API.replace('8080', '8001');
    } else {
      config.baseURL = process.env.VUE_APP_BASE_API;
    }
    if (config.method === 'post' || config.method === 'put') {
      config.data = encruption(store.getters.pubkey, config.data);
    }
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
    // if the custom code is not 10000, it is judged as an error.

    if (res.errorCode === 10500) {
      Message({
        dangerouslyUseHTMLString: true,
        message: `系统异常`,
        type: 'error',
        duration: 10 * 1000
      });
      return Promise.reject(new Error(res.errorMsg || 'Error'));
    }

    if (res.errorCode !== 10000) {
      Message({
        message: `${res.errorMsg || 'Error'}`,
        type: 'error',
        duration: 5 * 1000
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.errorCode === 10401) {
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

    if (data.errorCode === 10401) {
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
      return Promise.reject(new Error(data.errorMsg || 'Error'));
    }
    if (data.errorCode === 10500) {
      Message({
        dangerouslyUseHTMLString: true,
        message: `系统异常`,
        type: 'error',
        duration: 10 * 1000
      });
      return Promise.reject(new Error(data.errorMsg || 'Error'));
    }

    if (data.errorCode === 21011 || data.errorCode === 21012) {
      store.dispatch('user/refreshToken').then(() => {
        // requestQueue.forEach(item => {});
      });
      Promise.reject(error);
    } else {
      Message({
        dangerouslyUseHTMLString: true,
        message: `<p>CODE：${data.errorCode}</p><p>MESSAGE：${data.message}</p>`,
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
