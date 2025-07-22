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
        // Cabecera por defecto SOLO si el cuerpo NO es FormData
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el access token a cada request
apiClient.interceptors.request.use((config) => {
    /* 1.  Añadimos el token */
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    /* 2.  Si el cuerpo es FormData ⇒ borrar Content-Type global
           (el navegador lo generará con boundary)          */
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];  // Axios ≤1.6
        delete config.headers['content-type'];  // Axios ≥1.6
    }

    /* 3.  Si el componente envía headers['Content-Type'] = null|false
           también la quitamos (permite override manual)             */
    if (config.headers['Content-Type'] === null ||
        config.headers['Content-Type'] === false) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
    }

    return config;
}, (error) => Promise.reject(error));

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
