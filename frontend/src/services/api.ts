import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api' // Cambiar por la IP local para pruebas en dispositivos físicos
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;