// hooks/useAuth.js
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAccessToken,
    getRefreshToken,
    getUser,
    setUser,
    removeUser,
    removeAccessToken,
    removeRefreshToken,
} from '../utils/tokens';
import { useApi } from './useApi';

function isValid(value) {
    return typeof value === 'string'
        && value.trim() !== ''
        && value !== 'null'
        && value !== 'undefined';
}

export const useAuth = () => {
    const navigate = useNavigate();
    const { get, loading, error } = useApi();

    // Valida y devuelve el usuario actual (o null)
    const getCurrentUser = useCallback(() => {
        try {
            const userStr = getUser();
            if (!userStr) return null;
            const user = JSON.parse(userStr);
            return typeof user === 'string' ? JSON.parse(user) : user;
        } catch {
            removeUser();
            return null;
        }
    }, []);

    // Chequea acceso y estado de verificación, redirige si es necesario
    const checkAuthAndRedirect = useCallback(async (redirectIfVerified = '/dashboard', redirectIfNotVerified = '/login') => {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        const user = getCurrentUser();

        if (!isValid(accessToken) || !isValid(refreshToken) || !user) {
            removeUser();
            removeAccessToken();
            removeRefreshToken();
            navigate('/login', { replace: true });
            return false;
        }

        if (!isValid(user.email_verified_at)) {
            navigate(redirectIfNotVerified, { replace: true });
            return false;
        }

        // Si todo está bien, NO redirijas, deja al usuario en la ruta actual
        return true;
    }, [navigate, getCurrentUser]);


    // Refresca el usuario desde la API y actualiza el storage
    const refreshUser = useCallback(async () => {
        const accessToken = getAccessToken();
        if (!isValid(accessToken)) return null;

        const { success, data } = await get('auth/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            }
        });

        if (success && data?.user) {
            setUser(data.user);
            return data.user;
        }
        return null;
    }, [get]);

    return {
        loading,
        error,
        getCurrentUser,
        checkAuthAndRedirect,
        refreshUser,
        isValid,
    };
};
