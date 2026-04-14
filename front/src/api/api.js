import axios from 'axios';

const api = axios.create({
    //URL del servidor de Laravel
    baseURL: 'http://localhost/api',
});

/**
 * Cada vez que se haga una petición, de forma automática insertará el 
 * token de sanctum en el header.
 */
api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;