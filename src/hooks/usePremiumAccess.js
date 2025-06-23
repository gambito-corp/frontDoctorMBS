// src/hooks/usePremiumAccess.js
import { useState, useEffect } from 'react';

export const usePremiumAccess = () => {
    const [isPremium, setIsPremium] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        console.log('userData', userData);
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);

                // ✅ VERIFICAR SI ES PREMIUM
                const isProUser = parsedUser.is_pro === true || parsedUser.is_pro === 1;

                // ✅ CORREGIR: Verificar el array 'roles' en lugar de 'rol'
                const hasRootRole = parsedUser.roles && parsedUser.roles.includes('root');
                const hasRectorRole = parsedUser.roles && parsedUser.roles.includes('rector');

                const calculatedPremium = isProUser || hasRootRole || hasRectorRole;

                // ✅ DEBUG HARDCODEADO - Cambia este valor para probar
                const DEBUG_USER_TYPE = 'normal'; // Opciones: 'auto', 'normal', 'pro', 'root', 'rector'

                let finalPremiumStatus;

                switch (DEBUG_USER_TYPE) {
                    case 'normal':
                        finalPremiumStatus = false;
                        console.log('🔧 DEBUG: Forzando usuario NORMAL (no premium)');
                        break;
                    case 'pro':
                        finalPremiumStatus = true;
                        console.log('🔧 DEBUG: Forzando usuario PRO');
                        break;
                    case 'root':
                        finalPremiumStatus = true;
                        console.log('🔧 DEBUG: Forzando usuario ROOT');
                        break;
                    case 'rector':
                        finalPremiumStatus = true;
                        console.log('🔧 DEBUG: Forzando usuario RECTOR');
                        break;
                    case 'auto':
                    default:
                        finalPremiumStatus = calculatedPremium;
                        console.log('🔧 DEBUG: Usando detección automática');
                        break;
                }

                setIsPremium(finalPremiumStatus);

                // ✅ Debug para verificar
                console.log('isPremium result:', {
                    isProUser,
                    hasRootRole,
                    hasRectorRole,
                    calculatedPremium,
                    DEBUG_USER_TYPE,
                    finalPremiumStatus
                });

            } catch (error) {
                console.error('Error parsing user data:', error);
                setIsPremium(false);
            }
        } else {
            setIsPremium(false);
        }
    }, []);

    return { isPremium, user };
};
