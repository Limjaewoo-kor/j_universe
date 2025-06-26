import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API = axios.create({
  baseURL: API_BASE_URL
});

// 요청 인터셉터 설정 (요청 전에 토큰을 헤더에 포함시킴)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // localStorage에서 토큰을 가져옴
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;  // 헤더에 토큰을 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;