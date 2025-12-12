import axios from "axios";

// use Vite env variable if provided, fallback to localhost:8000
const base = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${base.replace(/\/$/, '')}/api`,
  withCredentials: true, // keep for Sanctum/cookie auth if used
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminAuthToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem("adminAuthToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default api;
