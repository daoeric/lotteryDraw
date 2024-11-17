import axios from 'axios';
import { getCookie } from './cookie';
// 获取当前访问的域名
const hostname = window.location.hostname;
// 获取当前访问的协议（http: 或 https:）
const protocol = window.location.protocol;
// 拼接 baseURL
// const baseURL = `${protocol}//${hostname}/code-api/`;

const baseURL = `http://localhost:8080/`;



//const baseURL = 'http://localhost:8080/';
const instance = axios.create({
    baseURL: baseURL,
    timeout: 20000
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        // 从 Cookie 中获取 Admin-Token
        const token = getCookie('Admin-Token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 响应拦截器（可选，用于处理通用错误）
instance.interceptors.response.use(
    response => response,
    error => {
        // 在这里处理如未授权等情况
        if (error.response && error.response.status === 401) {
            alert('未授权，请通过码商后台访问');
        }
        return Promise.reject(error);
    }
);

export default instance;
