// axiosInstance.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:7001',
  withCredentials: true, // Ensures cookies are sent with each request
});

// Response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Handle unauthorized errors globally (e.g., redirect to login)
        toast.error('Session expired. Redirecting to login.');
        Cookies.remove('jwtToken'); // Remove the token cookie
        window.location.href = '/login';
      } else if (status === 403) {
        // Handle forbidden errors
        toast.error(data.message || 'Access denied.');
      } else if (status >= 500) {
        // Handle server errors
        toast.error('Server is currently unavailable. Please try again later.');
      } else {
        // Handle other errors with specific messages
        toast.error(data.message || 'An error occurred.');
      }
    } else {
      // Handle network errors
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;