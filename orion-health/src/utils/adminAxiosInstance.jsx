// axios/adminAxiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";

const adminAxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for attaching token
adminAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling
adminAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        toast.error("Session expired. Redirecting to admin login.");
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      } else if (status === 403) {
        toast.error(data.message || "Access denied.");
      } else if (status >= 500) {
        toast.error("Server is currently unavailable. Please try again later.");
      } else {
        toast.error(data.message || "An error occurred.");
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default adminAxiosInstance;