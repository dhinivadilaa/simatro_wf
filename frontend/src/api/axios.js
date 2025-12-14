import axios from "axios";

// use Vite env variable if provided, fallback to localhost:8000
const base = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${base.replace(/\/$/, '')}/api`,
  withCredentials: true, // keep for Sanctum/cookie auth if used
});

// Import auth utilities (dynamic import to avoid circular dependency)
let authUtils = null;
try {
  import('../utils/auth.js').then(module => {
    authUtils = module;
  });
} catch (error) {
  console.warn('Auth utils not available:', error);
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add token for all requests when on admin pages
    if (window.location.pathname.startsWith('/admin')) {
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

// Debounce redirect to prevent multiple redirects
let redirectTimeout = null;
let redirectInProgress = false;

// Response interceptor - DISABLED to prevent redirect loops
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Export function to clear redirect timeout (useful for cleanup)
export const clearRedirectTimeout = () => {
  if (redirectTimeout) {
    clearTimeout(redirectTimeout);
    redirectTimeout = null;
  }
  redirectInProgress = false;
};

export default api;
