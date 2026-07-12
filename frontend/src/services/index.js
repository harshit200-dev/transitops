import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const vehicleService = {
  getAll: () => api.get('/vehicles'),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

export const driverService = {
  getAll: () => api.get('/drivers'),
  create: (data) => api.post('/drivers', data),
  update: (id, data) => api.put(`/drivers/${id}`, data),
  delete: (id) => api.delete(`/drivers/${id}`),
};

export const tripService = {
  getAll: () => api.get('/trips'),
  create: (data) => api.post('/trips', data),
  updateStatus: (id, status) => api.put(`/trips/${id}/status`, { status }),
};

export const maintenanceService = {
  getAll: () => api.get('/maintenance'),
  create: (data) => api.post('/maintenance', data),
  updateStatus: (id, status) => api.put(`/maintenance/${id}/status`, { status }),
};

export const fuelService = {
  getAll: () => api.get('/fuel'),
  create: (data) => api.post('/fuel', data),
};

export const expenseService = {
  getAll: () => api.get('/expenses'),
  create: (data) => api.post('/expenses', data),
};

export const analyticsService = {
  getDashboard: () => api.get('/analytics'),
};

export const aiService = {
  chat: (message) => api.post('/ai/chat', { message }),
};
