// src/hooks/usePremiumAccess.js - VERSIÓN ACTUALIZADA

import { useState, useEffect } from 'react';

export const usePremiumAccess = () => {
    const [isPremium, setIsPremium] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);

                // ✅ VERIFICAR SI ES PREMIUM
                const isProUser = parsedUser.is_pro === true || parsedUser.is_pro === 1;
                const hasRootRole = parsedUser.roles && parsedUser.roles.includes('root');
                const hasRectorRole = parsedUser.roles && parsedUser.roles.includes('rector');
                const calculatedPremium = isProUser || hasRootRole || hasRectorRole;

                // ✅ DEBUG HARDCODEADO - Cambia este valor para probar
                const DEBUG_USER_TYPE = 'auto'; // Opciones: 'auto', 'normal', 'pro', 'root', 'rector'

                let finalPremiumStatus;

                switch (DEBUG_USER_TYPE) {
                    case 'normal':
                        finalPremiumStatus = false;
                        break;
                    case 'pro':
                        finalPremiumStatus = true;
                        break;
                    case 'root':
                        finalPremiumStatus = true;
                        break;
                    case 'rector':
                        finalPremiumStatus = true;
                        break;
                    case 'auto':
                    default:
                        finalPremiumStatus = calculatedPremium;
                        break;
                }

                setIsPremium(finalPremiumStatus);
            } catch (error) {
                console.error('Error parsing user data:', error);
                setIsPremium(false);
            }
        } else {
            setIsPremium(false);
        }
    }, []);

    // ✅ FUNCIÓN PARA CAMBIAR ROL DE DEBUG (SOLO ROOT)
    const changeDebugRole = (newRole) => {
        if (!user || !user.roles || !user.roles.includes('root')) {
            return;
        }

        // Actualizar el localStorage temporalmente
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser };

        // Simular cambio de rol
        switch (newRole) {
            case 'normal':
                updatedUser.is_pro = false;
                updatedUser.roles = ['user'];
                break;
            case 'pro':
                updatedUser.is_pro = true;
                updatedUser.roles = ['user', 'pro'];
                break;
            case 'root':
                updatedUser.is_pro = true;
                updatedUser.roles = ['user', 'pro', 'root'];
                break;
            case 'rector':
                updatedUser.is_pro = true;
                updatedUser.roles = ['user', 'pro', 'rector'];
                break;
        }

        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Recargar la página para aplicar cambios
        window.location.reload();
    };

    // ✅ VERIFICAR SI ES ROOT
    const isRoot = user && user.roles && user.roles.includes('root');

    return {
        isPremium,
        user,
        isRoot,
        changeDebugRole
    };
};
