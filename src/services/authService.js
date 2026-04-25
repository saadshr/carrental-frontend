import API from './api';

const authService = {
  register: (data) => API.post('/register', data),
  login: async (data) => {
    const res = await API.post('/login', data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res;
  },
  logout: async () => {
    await API.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getMe: () => API.get('/me'),
  isLoggedIn: () => !!localStorage.getItem('token'),
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.role === 'admin';
  },
};

export default authService;
