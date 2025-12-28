import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { ElNotification } from 'element-plus';

// import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // api base_url
  timeout: 50000, // 请求超时时间
  withCredentials: true, // 跨域请求时是否需要使用凭证
});

// 存储 pending 的请求
const pendingMap = new Map<string, AbortController>();

/**
 * 生成唯一的请求 key
 * @param config
 */
const getPendingKey = (config: InternalAxiosRequestConfig) => {
  return [
    config.method,
    config.url,
    JSON.stringify(config.params),
    JSON.stringify(config.data),
  ].join('&');
};

/**
 * 添加请求到 pendingMap
 * @param config
 */
const addPending = (config: InternalAxiosRequestConfig) => {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    // 如果存在重复请求，取消前一个请求
    const controller = pendingMap.get(pendingKey);
    controller?.abort();
    pendingMap.delete(pendingKey);
  }
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingMap.set(pendingKey, controller);
};

/**
 * 移除请求
 * @param config
 */
const removePending = (config: InternalAxiosRequestConfig) => {
  const pendingKey = getPendingKey(config);
  if (pendingMap.has(pendingKey)) {
    pendingMap.delete(pendingKey);
  }
};

// request 拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 检查并处理重复请求
    removePending(config);
    addPending(config);

    // const token = useUserStore().token
    // if (token) {
    //   config.headers['token'] = 'Bearer ' + token
    // }
    return config;
  },
  (error: any) => {
    // 处理请求错误
    console.log(error); // for debug
    return Promise.reject(error);
  },
);

// response 拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 请求完成，移除 pending
    removePending(response.config as InternalAxiosRequestConfig);

    const res = response.data;
    if (res.code !== '2000') {
      ElNotification({
        title: '错误',
        message: `[${res.code}] ${res.message || '系统繁忙，请稍后再试'}`,
        type: 'error',
      });
      return Promise.reject(res);
    }
    return res;
  },
  (error: any) => {
    // 移除 pending
    if (error.config) {
      removePending(error.config);
    }

    // 如果是取消请求，不显示错误
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return Promise.reject(error);
    }

    let message = '系统繁忙，请稍后再试';
    const url = error?.config?.url || '未知请求';
    message = error.message;
    if (error?.response) {
      const { status, data } = error.response;
      // 优先使用后端返回的错误信息
      if (data && data.message) {
        message = data.message;
      } else {
        // 根据状态码处理默认信息
        switch (status) {
          case 400:
            message = '请求参数错误';
            break;
          case 401:
            message = '未授权，请登录';
            break;
          case 403:
            message = '拒绝访问';
            break;
          case 404:
            message = '请求地址出错';
            break;
          case 408:
            message = '请求超时';
            break;
          case 500:
            message = '服务器内部错误';
            break;
          case 501:
            message = '服务未实现';
            break;
          case 502:
            message = '网关错误';
            break;
          case 503:
            message = '服务不可用';
            break;
          case 504:
            message = '网关超时';
            break;
          case 505:
            message = 'HTTP版本不受支持';
            break;
          default:
            message = `连接出错(${status})`;
        }
      }
    } else {
      // 当没有 response 时，尝试从 message 中解析
      if (message.includes('timeout')) {
        message = '请求超时！请检查网络是否正常';
      } else if (message.includes('Network Error')) {
        message = '网络异常，请检查您的网络连接';
      } else if (message.includes('404')) {
        message = '请求地址出错';
      } else if (message.includes('500')) {
        message = '服务器内部错误';
      }
    }

    ElNotification({
      title: '错误',
      message: `[${error.code}] ${message} : ${url}`,
      type: 'error',
      duration: 3000,
    });
    return Promise.reject(error);
  },
);

/**
 * 封装 GET 请求
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 */
export function get<T = any>(url: string, params?: object): Promise<T> {
  return service.get(url, { params });
}

/**
 * 封装 POST 请求
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 */
export function post<T = any>(url: string, data?: object): Promise<T> {
  return service.post(url, data);
}

/**
 * 封装 PUT 请求
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 */
export function put<T = any>(url: string, data?: object): Promise<T> {
  return service.put(url, data);
}

/**
 * 封装 PATCH 请求
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 */
export function patch<T = any>(url: string, data?: object): Promise<T> {
  return service.patch(url, data);
}

/**
 * 封装 DELETE 请求
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 */
export function del<T = any>(url: string, params?: object): Promise<T> {
  return service.delete(url, { params });
}

export default service;
