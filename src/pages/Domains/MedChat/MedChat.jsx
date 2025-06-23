// src/pages/Domains/MedChat/MedChat.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useApi } from '../../../hooks/useApi';

const MedChat = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [chatStarted, setChatStarted] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);

    // ✅ PERSISTIR ÚLTIMA CONVERSACIÓN ACTIVA
    const [lastActiveConversation, setLastActiveConversation] = useLocalStorage('medchat_last_conversation', null);
    const [persistedMessages, setPersistedMessages] = useLocalStorage('medchat_messages', []);
    const [persistedChatStarted, setPersistedChatStarted] = useLocalStorage('medchat_started', false);
    const [autoLoadAttempted, setAutoLoadAttempted] = useState(false);

    const { get } = useApi();

    const handleToggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleLoadConversation = async (conversationId) => {
        console.log('🔄 Cargando conversación:', conversationId);

        try {
            if (window.loadConversation) {
                await window.loadConversation(conversationId);
                setCurrentConversationId(conversationId);
                setChatStarted(true);
                setSidebarCollapsed(true);

                // ✅ GUARDAR COMO ÚLTIMA CONVERSACIÓN ACTIVA
                setLastActiveConversation({
                    id: conversationId,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.error('💥 Error cargando conversación:', error);
        }
    };

    const handleNewChat = () => {
        console.log('🆕 Nuevo chat desde MedChat');
        setMessages([]);
        setChatStarted(false);
        setCurrentConversationId(null);
        setSidebarCollapsed(true);

        // ✅ LIMPIAR PERSISTENCIA
        setLastActiveConversation(null);
        setPersistedMessages([]);
        setPersistedChatStarted(false);

        if (window.handleNewChat) {
            window.handleNewChat();
        }
    };


    // ✅ SINCRONIZAR ESTADOS CON LOCALSTORAGE
    useEffect(() => {
        if (messages.length > 0) {
            setPersistedMessages(messages);
        }
    }, [messages, setPersistedMessages]);

    useEffect(() => {
        setPersistedChatStarted(chatStarted);
    }, [chatStarted, setPersistedChatStarted]);

    // ✅ RESTAURAR ESTADO AL CARGAR LA APLICACIÓN
    useEffect(() => {
        const restoreApplicationState = async () => {
            if (autoLoadAttempted) return;

            try {
                console.log('🔍 Restaurando estado de la aplicación...');

                // ✅ VERIFICAR SI HAY ESTADO PERSISTIDO
                if (persistedChatStarted && persistedMessages.length > 0 && lastActiveConversation) {
                    console.log('📋 Restaurando chat desde localStorage');
                    console.log('📋 Mensajes persistidos:', persistedMessages.length);
                    console.log('📋 Conversación activa:', lastActiveConversation.id);

                    // Restaurar estado local
                    setMessages(persistedMessages);
                    setChatStarted(persistedChatStarted);
                    setCurrentConversationId(lastActiveConversation.id);

                    // ✅ VERIFICAR QUE LA CONVERSACIÓN SIGA EXISTIENDO EN EL SERVIDOR
                    const response = await get('medchat/conversations');
                    if (response.success && response.data && response.data.data) {
                        const existsInServer = response.data.data.find(conv => conv.id === lastActiveConversation.id);
                        if (!existsInServer) {
                            console.warn('⚠️ La conversación persistida ya no existe en el servidor');
                            handleNewChat();
                        }
                    }
                } else {
                    // ✅ NO HAY ESTADO PERSISTIDO, VERIFICAR CONVERSACIONES EXISTENTES
                    console.log('📭 No hay estado persistido, verificando conversaciones...');

                    const response = await get('medchat/conversations');
                    if (response.success && response.data && response.data.data && response.data.data.length > 0) {
                        console.log(`✅ Encontradas ${response.data.data.length} conversaciones`);

                        // Cargar la conversación más reciente
                        const mostRecent = response.data.data[0];
                        await handleLoadConversation(mostRecent.id);
                    } else {
                        console.log('📭 No hay conversaciones, mostrando pantalla inicial');
                    }
                }
            } catch (error) {
                console.error('💥 Error restaurando estado:', error);
            } finally {
                setAutoLoadAttempted(true);
            }
        };

        // ✅ PEQUEÑO DELAY PARA ASEGURAR QUE TODO ESTÉ CARGADO
        const timer = setTimeout(restoreApplicationState, 300);

        return () => clearTimeout(timer);
    }, [get, lastActiveConversation, persistedMessages, persistedChatStarted, autoLoadAttempted]);

    return (
        <div className="h-screen grid grid-cols-[320px_1fr] lg:grid-cols-[320px_1fr] md:grid-cols-[1fr] overflow-hidden">
            <div className={`${sidebarCollapsed ? 'hidden lg:block' : 'block'} h-screen overflow-hidden`}>
                <Sidebar
                    isOpen={!sidebarCollapsed}
                    onToggle={handleToggleSidebar}
                    currentConversationId={currentConversationId}
                    onLoadConversation={handleLoadConversation}
                    onNewChat={handleNewChat}
                />
            </div>

            <div className="h-screen overflow-hidden">
                <ChatInterface
                    chatStarted={chatStarted}
                    setChatStarted={setChatStarted}
                    messages={messages}
                    setMessages={setMessages}
                    sidebarCollapsed={sidebarCollapsed}
                    currentConversationId={currentConversationId}
                    setCurrentConversationId={setCurrentConversationId}
                    onToggleSidebar={handleToggleSidebar}
                    autoLoadAttempted={autoLoadAttempted}
                />
            </div>
        </div>
    );
};

export default MedChat;
