import axios from 'axios';

// Base API URL - change this in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here in the future
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error: No response received');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods
export const driversAPI = {
  getAll: () => api.get('/drivers'),
  getById: (id) => api.get(`/drivers/${id}`),
};

export const vendorsAPI = {
  getAll: () => api.get('/vendors'),
  getByCategory: (category) => api.get(`/vendors/category/${category}`),
  recommend: (id) => api.post(`/vendors/${id}/recommend`),
};

export const deliveryAPI = {
  createRequest: (data) => api.post('/delivery/request', data),
};

export const ridesAPI = {
  getAll: () => api.get('/rides'),
  create: (data) => api.post('/rides/create', data),
  join: (id, name) => api.post(`/rides/${id}/join`, { name }),
  delete: (id) => api.delete(`/rides/${id}`),
};

export const paymentsAPI = {
  processTip: (data) => api.post('/payments/tip', data),
};

export default api;
