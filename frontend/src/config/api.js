// API Configuration
// This file centralizes all API endpoint configurations

// Determine API base URL based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Driver endpoints
  drivers: {
    getAll: `${API_BASE_URL}/api/drivers`,
    getById: (id) => `${API_BASE_URL}/api/drivers/${id}`,
  },

  // Vendor endpoints
  vendors: {
    getAll: `${API_BASE_URL}/api/vendors`,
    getById: (id) => `${API_BASE_URL}/api/vendors/${id}`,
  },

  // Delivery endpoints
  delivery: {
    request: `${API_BASE_URL}/api/delivery/request`,
    adminAll: `${API_BASE_URL}/api/delivery/admin/all`,
    authorize: (id) => `${API_BASE_URL}/api/delivery/admin/${id}/authorize`,
    assign: (id) => `${API_BASE_URL}/api/delivery/admin/${id}/assign`,
    updateStatus: (id) => `${API_BASE_URL}/api/delivery/admin/${id}/status`,
  },

  // Ride endpoints
  rides: {
    create: `${API_BASE_URL}/api/rides`,
    getAll: `${API_BASE_URL}/api/rides`,
    join: (id) => `${API_BASE_URL}/api/rides/${id}/join`,
    delete: (id) => `${API_BASE_URL}/api/rides/${id}`,
  },

  // Payment endpoints
  payments: {
    initiate: `${API_BASE_URL}/api/payments/initiate`,
    verify: `${API_BASE_URL}/api/payments/verify`,
  },
};

// Export base URL for custom requests
export const BASE_URL = API_BASE_URL;

export default API_ENDPOINTS;
