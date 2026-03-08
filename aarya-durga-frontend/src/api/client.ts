import axios, { AxiosInstance } from 'axios';

// Get API URL from environment, with fallback
const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    console.warn('VITE_API_URL not configured, falling back to localhost');
    return 'http://localhost:8000/api';
  }
  return apiUrl;
};

const client: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add auth token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default client;
