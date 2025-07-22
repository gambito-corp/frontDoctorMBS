import { useState, useCallback } from 'react';
import apiClient from '../api/axios';
import {
    getAccessToken,
    setAccessToken,
    getRefreshToken,
    removeUser,
    removeAccessToken,
    removeRefreshToken,
} from '../utils/tokens';

// Refresca el access token usando el refresh token
const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No hay refresh token disponible');

    // Ajusta la URL según tu backend
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    if (response.status === 200 && response.data.access_token) {
        setAccessToken(response.data.access_token);
        return response.data.access_token;
    }
    throw new Error('No se pudo refrescar el token');
};

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para hacer la petición y refrescar si es necesario
    const makeRequest = useCallback(async (method, url, data = null, config = {}) => {
        setLoading(true);
        setError(null);

        // Helper para ejecutar la petición con el access token actual
        const executeRequest = async (token) => {
            let response;
            const headers = { ...(config.headers || {}) };
            const finalConfig = { ...config, headers };

            switch (method.toLowerCase()) {
                case 'get':
                    response = await apiClient.get(url, finalConfig);
                    break;
                case 'post':
                    response = await apiClient.post(url, data, finalConfig);
                    break;
                case 'put':
                    response = await apiClient.put(url, data, finalConfig);
                    break;
                case 'delete':
                    response = await apiClient.delete(url, { ...finalConfig, data });
                    break;
                default:
                    throw new Error(`Método HTTP no soportado: ${method}`);
            }
            return response;
        };

        try {
            // Primer intento con el access token actual
            let response;
            try {
                response = await executeRequest();
            } catch (err) {
                // Si es 401, intenta refrescar el token y reintenta la petición
                if (err.response?.status === 401) {
                    try {
                        const newToken = await refreshAccessToken();
                        response = await executeRequest(newToken);
                    } catch (refreshError) {
                        // El refresh falló: limpia sesión y lanza error
                        removeUser();
                        removeAccessToken();
                        removeRefreshToken();
                        setError('Sesión expirada. Por favor, inicia sesión de nuevo.');
                        return {
                            success: false,
                            error: 'Sesión expirada. Por favor, inicia sesión de nuevo.',
                            status: 401,
                        };
                    }
                } else {
                    throw err;
                }
            }

            return {
                success: true,
                data: response.data,
                status: response.status,
            };
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.error || 'Error en la petición';
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
                status: err.response?.status,
            };
        } finally {
            setLoading(false);
        }
    }, []);

    // Métodos HTTP
    const get = useCallback((url, config = {}) => makeRequest('get', url, null, config), [makeRequest]);
    const post = useCallback((url, data, config = {}) => makeRequest('post', url, data, config), [makeRequest]);
    const put = useCallback((url, data, config = {}) => makeRequest('put', url, data, config), [makeRequest]);
    const del = useCallback((url, data = null, config = {}) => makeRequest('delete', url, data, config), [makeRequest]);

    return {
        loading,
        error,
        get,
        post,
        put,
        delete: del,
        makeRequest,
    };
};
