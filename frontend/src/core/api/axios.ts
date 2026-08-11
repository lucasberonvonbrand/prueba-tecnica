import axios from 'axios';

export const api = axios.create({
  baseURL: ((import.meta.env.VITE_API_URL || (typeof process !== 'undefined' ? process.env.VITE_API_URL : undefined) || 'http://localhost:3000') + '/api'),
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('El usuario no está autenticado o la sesión expiró.');
    }
    return Promise.reject(error);
  }
);
