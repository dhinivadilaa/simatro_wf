import axios from "axios";

// use Vite env variable if provided, fallback to localhost:8000
const base = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${base.replace(/\/$/, '')}/api`,
  withCredentials: true, // keep for Sanctum/cookie auth if used
});

export default api;
