import axios from 'axios';

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `http://${window.location.hostname}:8000/api/`;
  }
  return 'http://127.0.0.1:8000/api/';
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('applinex_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Handle 401 and attempt refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('applinex_refresh');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}auth/refresh/`, { refresh: refreshToken });
          const newAccess = res.data.access;
          localStorage.setItem('applinex_token', newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('applinex_token');
          localStorage.removeItem('applinex_refresh');
          localStorage.removeItem('applinex_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('auth/login/', credentials),
  register: (userData) => api.post('auth/register/', userData),
  getProfile: () => api.get('auth/profile/'),
  updateProfile: (data) => api.put('auth/profile/', data),
  uploadAvatar: (formData) => api.post('auth/upload-avatar/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  forgotPassword: (email) => api.post('auth/forgot-password/', { email }),
  resetPassword: (data) => api.post('auth/reset-password/', data),
  getUsers: (params) => api.get('auth/users/', { params }),
  getUser: (id) => api.get(`auth/users/${id}/`),
  createUser: (data) => api.post('auth/admin/create-user/', data),
  updateUser: (id, data) => api.put(`auth/users/${id}/`, data),
  getCustomerStats: () => api.get('auth/customer-stats/'),
  submitKyc: (data) => api.post('auth/kyc/submit/', data),
  verifyUserKyc: (userId, data) => api.put(`auth/admin/users/${userId}/kyc/`, data),
};

export const uploadApi = {
  uploadImage: (formData) => api.post('upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};


export const appliancesApi = {
  getCategories: () => api.get('categories/'),
  getAppliances: (params) => api.get('appliances/', { params }),
  getAppliance: (id) => api.get(`appliances/${id}/`),
  getFilterMeta: () => api.get('appliances/filter-meta/'),
  createAppliance: (data) => api.post('appliances/', data),
  updateAppliance: (id, data) => api.put(`appliances/${id}/`, data),
  deleteAppliance: (id) => api.delete(`appliances/${id}/`),
};

export const rentalsApi = {
  calculate: (data) => api.post('rentals/calculate/', data),
  getRentals: (params) => api.get('rentals/', { params }),
  getRental: (idOrCode) => api.get(`rentals/${idOrCode}/`),
  createRental: (data) => api.post('rentals/', data),
  updateStatus: (id, data) => api.put(`rentals/${id}/status/`, data),
  requestReturn: (id) => api.post(`rentals/${id}/request-return/`),
  requestRelocation: (id, data) => api.post(`rentals/${id}/relocate/`, data),
  settleDeposit: (id, data) => api.post(`rentals/${id}/settle-deposit/`, data),
  payInvoice: (invoiceId) => api.post(`rentals/invoices/${invoiceId}/pay/`),
};

export const paymentsApi = {
  getPayments: (params) => api.get('payments/', { params }),
  processPayment: (data) => api.post('payments/', data),
  getReceipt: (id) => api.get(`payments/${id}/receipt/`),
  refundPayment: (id) => api.post(`payments/${id}/refund/`),
};

export const reviewsApi = {
  getReviews: (params) => api.get('reviews/', { params }),
  createReview: (data) => api.post('reviews/', data),
  getModerationList: (params) => api.get('reviews/moderation/', { params }),
  moderateReview: (id, data) => api.put(`reviews/${id}/moderate/`, data),
};

export const maintenanceApi = {
  getLogs: (params) => api.get('maintenance/', { params }),
  createLog: (data) => api.post('maintenance/', data),
  updateLog: (id, data) => api.patch(`maintenance/${id}/`, data),
  getReturns: () => api.get('maintenance/returns/'),
  processReturn: (id, data) => api.post(`maintenance/returns/${id}/process/`, data),
};

export const supportApi = {
  getTickets: (params) => api.get('support/tickets/', { params }),
  createTicket: (data) => api.post('support/tickets/', data),
  updateTicket: (id, data) => api.patch(`support/tickets/${id}/`, data),
  resolveTicket: (id, data) => api.patch(`support/tickets/${id}/`, data),
  getComplaints: (params) => api.get('support/complaints/', { params }),
  createComplaint: (data) => api.post('support/complaints/', data),
  updateComplaint: (id, data) => api.patch(`support/complaints/${id}/`, data),
  resolveComplaint: (id, data) => api.patch(`support/complaints/${id}/`, data),
  getDashboard: () => api.get('support/dashboard/'),
  getDashboardMetrics: () => api.get('support/dashboard/'),
};

export const reportsApi = {
  getAnalytics: () => api.get('reports/analytics/'),
  getRentals: (params) => api.get('reports/rentals/', { params }),
  getRentalReport: (params) => api.get('reports/rentals/', { params }),
  getStock: (params) => api.get('reports/stock/', { params }),
  getStockReport: (params) => api.get('reports/stock/', { params }),
  getRevenue: (params) => api.get('reports/revenue/', { params }),
  getRevenueReport: (params) => api.get('reports/revenue/', { params }),
};

export const aiApi = {
  getRecommendations: () => api.get('ai/recommendations/'),
  getDemandForecast: (params) => api.get('ai/demand-forecast/', { params }),
};

export default api;
