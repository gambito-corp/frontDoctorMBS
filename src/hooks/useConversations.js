// src/hooks/useConversations.js
import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

export const useConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(null);
    const { get, put, delete: del } = useApi();

    // ✅ CACHE CON TTL (Time To Live)
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

    // ✅ CARGAR TODAS LAS CONVERSACIONES
    const fetchConversations = useCallback(async (forceRefresh = false) => {
        if (!forceRefresh && lastFetch && (Date.now() - lastFetch < CACHE_TTL)) {
            console.log('📋 Usando conversaciones desde cache');
            return;
        }
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Cargando conversaciones...');
            const response = await get('medchat/conversations');
            console.log('📥 Respuesta conversaciones:', response);

            if (response.success) {
                const conversationsData = response.data.data;
                if (Array.isArray(conversationsData)) {
                    setConversations(conversationsData);
                    setLastFetch(Date.now());
                    console.log('✅ Conversaciones cargadas:', conversationsData.length);
                } else {
                    console.warn('⚠️ La respuesta no es un array:', conversationsData);
                    setConversations([]);
                }
            } else {
                setError(response.error || 'Error al cargar conversaciones');
                console.error('❌ Error en respuesta:', response.error);
                setConversations([]);
            }
        } catch (err) {
            setError('Error de conexión al cargar conversaciones');
            console.error('💥 Error fetching conversations:', err);
            setConversations([]);
        } finally {
            setLoading(false);
        }
    }, [get, lastFetch]);

    const refreshConversations = useCallback(() => {
        return fetchConversations(true);
    }, [fetchConversations]);

    // Actualizar título de conversación
    const updateConversationTitle = useCallback(async (conversationId, newTitle) => {
        try {
            console.log('✏️ Actualizando título:', conversationId, newTitle);

            const response = await put(`medchat/conversations/${conversationId}/title`, {
                title: newTitle
            });

            if (response.success) {
                setConversations(prev => {
                    if (!Array.isArray(prev)) {
                        console.warn('⚠️ conversations no es un array:', prev);
                        return [];
                    }

                    return prev.map(conv =>
                        conv.id === conversationId
                            ? { ...conv, title: newTitle, updated_at: response.data?.updated_at || new Date().toISOString() }
                            : conv
                    );
                });
                console.log('✅ Título actualizado correctamente');
                return true;
            } else {
                setError(response.error || 'Error al actualizar título');
                console.error('❌ Error actualizando título:', response.error);
                return false;
            }
        } catch (err) {
            setError('Error de conexión al actualizar título');
            console.error('💥 Error updating title:', err);
            return false;
        }
    }, [put]);

    // Eliminar conversación
    const deleteConversation = useCallback(async (conversationId) => {
        try {
            console.log('🗑️ Eliminando conversación:', conversationId);

            const response = await del(`medchat/conversations/${conversationId}`);

            if (response.success) {
                setConversations(prev => {
                    if (!Array.isArray(prev)) {
                        console.warn('⚠️ conversations no es un array:', prev);
                        return [];
                    }

                    return prev.filter(conv => conv.id !== conversationId);
                });
                console.log('✅ Conversación eliminada correctamente');
                return true;
            } else {
                setError(response.error || 'Error al eliminar conversación');
                console.error('❌ Error eliminando conversación:', response.error);
                return false;
            }
        } catch (err) {
            setError('Error de conexión al eliminar conversación');
            console.error('💥 Error deleting conversation:', err);
            return false;
        }
    }, [del]);

    // ✅ CARGAR CONVERSACIONES AL MONTAR EL HOOK - SIN PARÁMETROS
    useEffect(() => {
        fetchConversations(); // ✅ SIN PARÁMETROS - USA EL VALOR POR DEFECTO false
    }, []); // ✅ DEPENDENCIAS VACÍAS PARA QUE SOLO SE EJECUTE AL MONTAR

    return {
        conversations: Array.isArray(conversations) ? conversations : [],
        loading,
        error,
        fetchConversations,
        refreshConversations,
        updateConversationTitle,
        deleteConversation
    };
};
