import axios from 'axios';

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // api base_url
  timeout: 5000 // 请求超时时间
});

// request 拦截器
service.interceptors.request.use(
  config => {
    // 在这里可以添加 token 等
    // const token = useUserStore().token
    // if (token) {
    //   config.headers['Authorization'] = 'Bearer ' + token
    // }
    return config;
  },
  error => {
    // 处理请求错误
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 这里可以根据后端返回的状态码做统一处理
    return res;
  },
  error => {
    console.log('err' + error); // for debug
    return Promise.reject(error);
  }
);

/**
 * 封装 GET 请求
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 */
export function get(url, params) {
  return service.get(url, { params });
}

/**
 * 封装 POST 请求
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 */
export function post(url, data) {
  return service.post(url, data);
}

/**
 * 封装 PUT 请求
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 */
export function put(url, data) {
  return service.put(url, data);
}

/**
 * 封装 PATCH 请求
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 */
export function patch(url, data) {
  return service.patch(url, data);
}

/**
 * 封装 DELETE 请求
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 */
export function del(url, params) {
  return service.delete(url, { params });
}

export default service;
