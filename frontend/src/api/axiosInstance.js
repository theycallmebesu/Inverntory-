import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE_DEV || 'http://localhost:5000/api')
  : (import.meta.env.VITE_API_BASE_PROD || '/api');

const axiosInstance = axios.create({
  baseURL: API_BASE_URL
});

// Add a request interceptor to attach JWT token to every request header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 unauthorized globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
