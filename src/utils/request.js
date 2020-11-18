import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import JsEncrypt from 'jsencrypt';
function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
      str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}
JsEncrypt.prototype.encryptLong = function(string) {
	var k = this.getKey();
	try {
		var ct = "";
		// RSA每次加密117bytes，需要辅助方法判断字符串截取位置
		// 1.获取字符串截取点
		var bytes = [];
		bytes.push(0);
		var byteNo = 0;
    var len, c;
    len = string.length;
    var temp = 0;
    for (let i = 0; i < len; i++) {
      c = string.charCodeAt(i);
      if (c >= 0x010000 && c <= 0x10FFFF) {
        byteNo += 4;
      } else if (c >= 0x000800 && c <= 0x00FFFF) {
        byteNo += 3;
      } else if (c >= 0x000080 && c <= 0x0007FF) {
        byteNo += 2;
      } else {
        byteNo += 1;
      }
      if ((byteNo % 117) >= 114 || (byteNo % 117) === 0) {
        if (byteNo - temp >= 114) {
          bytes.push(i);
          temp = byteNo;
        }
      }
    }
		// 2.截取字符串并分段加密
    if (bytes.length > 1) {
      for (let i = 0; i < bytes.length - 1; i++) {
        var str;
        if (i === 0) {
          str = string.substring(0, bytes[i + 1] + 1);
        } else {
          str = string.substring(bytes[i] + 1, bytes[i + 1] + 1);
        }
        var t1 = k.encrypt(str);
        ct += t1;
      }
      if (bytes[bytes.length - 1] !== string.length - 1) {
        var lastStr = string.substring(bytes[bytes.length - 1] + 1);
        ct += k.encrypt(lastStr);
      }
      return hexToBase64(ct);
    }
		var t = k.encrypt(string);
		var y = hexToBase64(t);
		return y;
	} catch (ex) {
		return false;
	}
};

const encruption = (key, obj) => {
  if (!obj) {
    return null;
  }
  const encrypt = new JsEncrypt();
  encrypt.setPublicKey(key);
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
