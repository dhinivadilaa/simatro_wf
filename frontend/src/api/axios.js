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
    // Only add token for admin routes
    if (config.url.includes('/admin/') || window.location.pathname.startsWith('/admin')) {
      const token = localStorage.getItem("adminAuthToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
      // Only redirect to admin login if we're on admin pages
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem("adminAuthToken");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
