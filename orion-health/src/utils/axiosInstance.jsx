// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7001', // Update with your backend's base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Use standard Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;