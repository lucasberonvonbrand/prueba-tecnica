import axios from 'axios';

// Instancia base de Axios para consumir nuestra API
// Es el equivalente moderno a inyectar el HttpClient en Angular
const isServer = typeof window === 'undefined';

export const api = axios.create({
  baseURL: isServer 
    ? ((process.env.API_URL || 'http://localhost:3000') + '/api') 
    : ((import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api'), 
  withCredentials: true, // Permite enviar cookies de sesión (necesario para Better Auth en modo web)
});

// Ejemplo de Interceptor (Idéntico al concepto de HttpInterceptor en Angular)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí podemos atrapar los errores 401 (No autorizado) de forma global
    if (error.response?.status === 401) {
      console.error('El usuario no está autenticado o la sesión expiró.');
      // Más adelante podemos integrar redirecciones aquí
    }
    return Promise.reject(error);
  }
);
