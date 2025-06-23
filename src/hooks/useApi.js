import { useState, useCallback } from 'react';
import axios from 'axios';
export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const apiClient = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + (localStorage.getItem(process.env.REACT_APP_TOKEN_STORAGE_KEY || "sanctum_token") || ""),
        },
    });
    const makeRequest = useCallback(async (method, url, data = null, config = {}) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            switch (method.toLowerCase()) {
                case 'get':
                    response = await apiClient.get(url, config);
                    break;
                case 'post':
                    response = await apiClient.post(url, data, config);
                    break;
                case 'put':
                    response = await apiClient.put(url, data, config);
                    break;
                case 'delete':
                    // ✅ Manejar DELETE con body
                    if (config.data) {
                        response = await apiClient.delete(url, { ...config, data: config.data });
                    } else {
                        response = await apiClient.delete(url, config);
                    }
                    break;
                default:
                    throw new Error(`Método HTTP no soportado: ${method}`);
            }
            return {
                success: true,
                data: response.data,
                status: response.status
            };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error en la petición';
            setError(errorMessage);
            return {
                success: false,
                error: errorMessage,
                status: err.response?.status
            };
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback((url, config = {}) => makeRequest('get', url, null, config), [makeRequest]);
    const post = useCallback((url, data, config = {}) => makeRequest('post', url, data, config), [makeRequest]);
    const put = useCallback((url, data, config = {}) => makeRequest('put', url, data, config), [makeRequest]);
    const del = useCallback((url, data = null, config = {}) => {if (data) {config.data = data;}return makeRequest('delete', url, null, config);}, [makeRequest]);

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
