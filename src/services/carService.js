import API from './api';

const carService = {
  getAll: (filters = {}) => API.get('/cars', { params: filters }),
  getOne: (id) => API.get(`/cars/${id}`),
  create: (data) => API.post('/cars', data),
  update: (id, data) => API.put(`/cars/${id}`, data),
  delete: (id) => API.delete(`/cars/${id}`),
};

export default carService;
