import axios from 'axios';

export const api = axios.create({
  baseURL: '//localhost:3001'
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('vsm-token');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error)
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.status === 401) {
      location.href = '/login';
    }

    return Promise.reject(error);
  }
)