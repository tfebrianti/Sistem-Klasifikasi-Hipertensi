import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Set initial Authorization header if token exists in localStorage
const savedToken = localStorage.getItem('token');
if (savedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

// Request Interceptor: Automatically attach Sanctum token if present
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token || localStorage.getItem('token');
    if (token && config.headers) {
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Auto-logout on 401 Unauthorized for authenticated routes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || '';
      // Do not trigger global logout if the 401 was from public auth endpoints
      if (
        !requestUrl.includes('/login') &&
        !requestUrl.includes('/register') &&
        !requestUrl.includes('/forgot-password') &&
        !requestUrl.includes('/reset-password')
      ) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
export default api;
