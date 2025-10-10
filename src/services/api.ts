import axios from 'axios';

// Configuração base do axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
});

// Interceptor para adicionar CSRF token se existir
api.interceptors.request.use((config) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  return config;
});

export default api;
