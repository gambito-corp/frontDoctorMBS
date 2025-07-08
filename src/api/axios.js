import axios from 'axios';
import {
    getAccessToken,
    setAccessToken,
    getRefreshToken,
    setRefreshToken,
    removeAccessToken,
    removeRefreshToken,
} from '../utils/tokens';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el access token a cada request
apiClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de respuesta para renovar el token si expira
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Si el error es 401 y no es el endpoint de refresh, intenta renovar
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) throw new Error('No refresh token');
                // Endpoint de tu backend para renovar token
                const res = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
                setAccessToken(res.data.access_token);
                setRefreshToken(res.data.refresh_token);
                // Reintenta la petición original con el nuevo access token
                originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Si falla la renovación, limpia tokens y redirige a login
                removeAccessToken();
                removeRefreshToken();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
