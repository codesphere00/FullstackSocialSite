/**
 * axiosConfig.js
 * Central Axios instance – change BASE_URL to match your backend.
 * All other API files import from here.
 */
import axios from 'axios';

// ── Change this to your backend URL ──────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// ─────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: automatically attach the JWT token
 * stored in localStorage to every outgoing request.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: handle global 401 (token expired / invalid).
 * Clears local storage and forces the user back to /login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
