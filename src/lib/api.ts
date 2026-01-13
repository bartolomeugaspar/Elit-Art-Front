import axios from 'axios';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

/**
 * Build API URL
 * @param endpoint - endpoint path (e.g., 'auth/login')
 * @returns full URL
 */
export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.replace(/^\/+/, ''); // Remove leading slashes
  return `${API_URL}/${cleanEndpoint}`;
};

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = buildApiUrl(endpoint);
  const response = await fetch(url, options);
  return response;
};

export const apiCallWithAuth = async (endpoint: string, token: string, options?: RequestInit) => {
  const url = buildApiUrl(endpoint);
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
