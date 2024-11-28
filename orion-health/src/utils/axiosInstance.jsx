import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7001', // Update with your backend's base URL
  withCredentials: true, // Automatically include cookies in requests
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;