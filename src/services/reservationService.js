import API from './api';

const reservationService = {
  getMyReservations: () => API.get('/reservations'),
  getAllReservations: () => API.get('/admin/reservations'),
  create: (data) => API.post('/reservations', data),
  cancel: (id) => API.put(`/reservations/${id}/cancel`),
  confirm: (id) => API.put(`/admin/reservations/${id}/confirm`),
  getDashboard: () => API.get('/dashboard'),
  getAdminDashboard: () => API.get('/admin/dashboard'),
  calculatePrice: (startDate, endDate, pricePerDay) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return { days, total: days * pricePerDay };
  },
};

export default reservationService;