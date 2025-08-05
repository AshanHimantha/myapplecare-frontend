
import axios from 'axios';
import useAuthStore from '../stores/authStore';



const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://systemapi.1000dtechnology.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
 
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Try to get token from Zustand store first, fallback to localStorage
    const token = useAuthStore.getState().token || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;