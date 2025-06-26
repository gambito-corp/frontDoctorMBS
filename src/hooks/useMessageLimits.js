// src/hooks/useMessageLimits.js - VERSIÓN FINAL
import { useState, useEffect, useCallback } from 'react';
import { usePremiumAccess } from './usePremiumAccess';
import { useApi } from './useApi';

export const useMessageLimits = () => {
    const { isPremium, user } = usePremiumAccess();
    const { get, post } = useApi();

    const [usageData, setUsageData] = useState({
        userType: 'normal',
        userLimits: { simple: 10, standard: 10, deep_research: 2 },
        usageCount: { simple: 0, standard: 0, deep_research: 0 },
        remainingMessages: { simple: 10, standard: 10, deep_research: 2 },
        canSendMessage: { simple: true, standard: true, deep_research: true },
        resetInfo: null
    });

    const [loading, setLoading] = useState(false);
    const [lastSync, setLastSync] = useState(null);
    const [error, setError] = useState(null);

    // ✅ CARGAR LÍMITES DESDE EL SERVIDOR
    const loadUserLimits = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const response = await get('medchat/usage-limits');
            console.log('ESTO ES LA RESPUESTA DE USAGE LIMITS', response);
            if (response.success) {
                const data = response.data.data;
                setUsageData({
                    userType: data.user_type,
                    userLimits: data.user_limits,
                    usageCount: data.usage_count,
                    remainingMessages: data.remaining_messages,
                    canSendMessage: data.can_send_message,
                    resetInfo: data.reset_info
                });
                setLastSync(new Date());

                console.log('📊 Límites cargados:', data);
            } else {
                throw new Error(response.error || 'Error cargando límites');
            }
        } catch (error) {
            console.error('❌ Error cargando límites:', error);
            setError(error.message);
            // ✅ Fallback a valores por defecto
            loadDefaultLimits();
        } finally {
            setLoading(false);
        }
    }, [user, get]);

    // ✅ VERIFICAR SI PUEDE ENVIAR MENSAJE (SERVIDOR)
    const canSendMessageServer = useCallback(async (searchType) => {
        try {
            const response = await post('medchat/usage/can-send', {
                search_type: searchType
            });

            if (response.success) {
                return response.data.data.can_send;
            }
            return false;
        } catch (error) {
            console.error('❌ Error verificando límites:', error);
            // ✅ Fallback a verificación local
            return usageData.canSendMessage[searchType] || false;
        }
    }, [post, usageData.canSendMessage]);

    // ✅ VERIFICAR SI PUEDE ENVIAR MENSAJE (LOCAL)
    const canSendMessage = useCallback((searchType) => {
        return usageData.canSendMessage[searchType] || false;
    }, [usageData.canSendMessage]);

    // ✅ OBTENER MENSAJES RESTANTES
    const getRemainingMessages = useCallback((searchType) => {
        return usageData.remainingMessages[searchType] || 0;
    }, [usageData.remainingMessages]);

    // ✅ INCREMENTAR USO (SOLO LOCAL, EL SERVIDOR SE ACTUALIZA EN ASK)
    const incrementUsage = useCallback((searchType) => {
        setUsageData(prev => {
            const newUsage = {
                ...prev.usageCount,
                [searchType]: (prev.usageCount[searchType] || 0) + 1
            };

            const limit = prev.userLimits[searchType];
            const remaining = limit === -1 ? -1 : Math.max(0, limit - newUsage[searchType]);
            const canSend = limit === -1 ? true : newUsage[searchType] < limit;

            return {
                ...prev,
                usageCount: newUsage,
                remainingMessages: {
                    ...prev.remainingMessages,
                    [searchType]: remaining
                },
                canSendMessage: {
                    ...prev.canSendMessage,
                    [searchType]: canSend
                }
            };
        });

        console.log(`📈 Uso incrementado localmente: ${searchType}`);
    }, []);

    // ✅ CARGAR VALORES POR DEFECTO
    const loadDefaultLimits = useCallback(() => {
        const userType = getUserTypeLocal();
        const limits = getLocalLimits(userType);

        setUsageData({
            userType,
            userLimits: limits,
            usageCount: { simple: 0, standard: 0, deep_research: 0 },
            remainingMessages: {
                simple: limits.simple === -1 ? -1 : limits.simple,
                standard: limits.standard === -1 ? -1 : limits.standard,
                deep_research: limits.deep_research === -1 ? -1 : limits.deep_research
            },
            canSendMessage: { simple: true, standard: true, deep_research: true },
            resetInfo: null
        });
    }, []);

    // ✅ HELPERS LOCALES
    const getUserTypeLocal = () => {
        if (!user) return 'normal';
        if (user.roles && (user.roles.includes('root') || user.roles.includes('rector'))) return 'admin';
        if (isPremium) return 'premium';
        return 'normal';
    };

    const getLocalLimits = (userType) => {
        const LIMITS = {
            normal: { simple: 10, standard: 10, deep_research: 2 },
            premium: { simple: -1, standard: -1, deep_research: 50 },
            admin: { simple: -1, standard: -1, deep_research: -1 }
        };
        return LIMITS[userType];
    };

    // ✅ CARGAR AL MONTAR Y CUANDO CAMBIE EL USUARIO
    useEffect(() => {
        if (user) {
            loadUserLimits();
        } else {
            loadDefaultLimits();
        }
    }, [user, loadUserLimits, loadDefaultLimits]);

    // ✅ SINCRONIZAR CADA 5 MINUTOS
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            loadUserLimits();
        }, 5 * 60 * 1000); // 5 minutos

        return () => clearInterval(interval);
    }, [user, loadUserLimits]);

    return {
        // ✅ DATOS
        userType: usageData.userType,
        userLimits: usageData.userLimits,
        usageCount: usageData.usageCount,
        remainingMessages: usageData.remainingMessages,
        resetInfo: usageData.resetInfo,

        // ✅ FUNCIONES
        canSendMessage,
        canSendMessageServer,
        getRemainingMessages,
        incrementUsage,
        refreshLimits: loadUserLimits,

        // ✅ ESTADO
        isPremium,
        loading,
        error,
        lastSync
    };
};
