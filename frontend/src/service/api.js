import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // URL do seu backend
  timeout: 10000,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      // 👉 Não recarrega, apenas rejeita o erro
      // O componente de login já trata esse erro via catch()
    }
    return Promise.reject(error);
  }
);

export default api;