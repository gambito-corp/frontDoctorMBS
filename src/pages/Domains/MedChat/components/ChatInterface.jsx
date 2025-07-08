// src/pages/Domains/MedChat/components/ChatInterface.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApi } from '../../../../hooks/useApi';
import MessageBubble from './MessageBubble';
import ThinkingLoader from "./ThinkingLoader";
import SearchTypeSelector from './SearchTypeSelector';
import FilterModal from './FilterModal';
import { Send, Paperclip, Mic, AlertCircle } from 'lucide-react';
import 'react-tooltip/dist/react-tooltip.css'; // ✅ IMPORTANTE: Importar CSS
import { usePremiumAccess } from '../../../../hooks/usePremiumAccess';
import { useMessageLimits } from '../../../../hooks/useMessageLimits';
import FutureFeatureModal from '../../../../components/FutureFeatureModal';

const ChatInterface = ({
                           chatStarted,
                           setChatStarted,
                           messages,
                           setMessages,
                           sidebarCollapsed,
                           autoLoadAttempted = false
                       }) => {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');
    const [streamingMessageId, setStreamingMessageId] = useState(null);
    const [error, setError] = useState('');
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [searchType, setSearchType] = useState('standard');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [conversationsLoading, setConversationsLoading] = useState(false);
    const [showFutureModal, setShowFutureModal] = useState(false);
    const [futureFeatureType, setFutureFeatureType] = useState('attachment');
    const [showLimitWarning, setShowLimitWarning] = useState(false);


    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    const { post, get } = useApi();
    const { isPremium } = usePremiumAccess();
    const {
        canSendMessage,
        getRemainingMessages,
        incrementUsage,
        refreshLimits,
        userType,
        userLimits,        // ✅ NECESARIO para las barras de progreso
        usageCount,        // ✅ NECESARIO para mostrar uso actual
        resetInfo,         // ✅ NECESARIO para mostrar días hasta reset
        loading: limitsLoading
    } = useMessageLimits();

    // ✅ FUNCIÓN PARA VERIFICAR SI HAY FILTROS ACTIVOS
    const hasActiveFilters = useCallback(() => {
        return Object.keys(activeFilters).length > 0 &&
            Object.values(activeFilters).some(value => {
                if (Array.isArray(value)) return value.length > 0;
                if (typeof value === 'boolean') return value;
                if (typeof value === 'string') return value !== '';
                return typeof value === 'number';

            });
    }, [activeFilters]);

    // ✅ FUNCIÓN HANDLESUBMIT ACTUALIZADA CON FILTROS Y SEARCH TYPE
    const handleSubmit = useCallback(async (e, customText = null) => {
        e.preventDefault();
        const textToSend = customText || inputValue.trim();

        if (!textToSend || isLoading) {
            console.error('❌ Envío bloqueado - input vacío o cargando');
            return;
        }

        if (!canSendMessage(searchType)) {
            setShowLimitWarning(true);
            setTimeout(() => setShowLimitWarning(false), 3000);
            return;
        }

        // ✅ INCREMENTAR USO LOCAL INMEDIATAMENTE
        incrementUsage(searchType);

        const userMessage = {
            id: generateUniqueId(),
            type: 'user',
            content: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setChatStarted(true);
        setError('');
        setShouldAutoScroll(true);
        setIsUserScrolling(false);

        try {
            // ✅ PREPARAR REQUEST DATA CON FILTROS Y SEARCH TYPE
            const requestData = {
                question: textToSend,
                conversation_id: currentConversationId,
                chat_history: [],
                search_type: searchType,
                ...(hasActiveFilters() && { filters: activeFilters })
            };

            const response = await post('medchat/ask', requestData);
            if (response.success) {
                const aiResponse = response.data.data.data.answer;
                const pubmedArticles = response.data.data.data.pubmed_articles || [];
                const conversationId = response.data.data.conversation_id;
                const usageInfo = response.data.usage_info || {};

                setTimeout(() => {
                    refreshLimits();
                }, 2000);

                if (!currentConversationId && conversationId) {
                    setCurrentConversationId(conversationId);
                }

                if (!aiResponse || typeof aiResponse !== 'string' || aiResponse.trim() === '') {
                    console.error('❌ aiResponse inválido:', aiResponse);
                    setIsLoading(false);
                    return;
                }

                const aiMessageId = generateUniqueId();
                const aiMessage = {
                    id: aiMessageId,
                    type: 'ai',
                    content: '',
                    timestamp: new Date(),
                    streaming: true,
                    pubmedArticles: pubmedArticles,
                    searchType: searchType,
                    usageInfo: usageInfo
                };

                setStreamingMessageId(aiMessageId);
                setMessages(prev => [...prev, aiMessage]);
                setIsLoading(false);

                // Efecto de máquina de escribir
                let currentText = '';
                for (let i = 0; i < aiResponse.length; i++) {
                    currentText += aiResponse[i];
                    setStreamingMessage(currentText);

                    const char = aiResponse[i];
                    let delay = 2;
                    if (char === '.' || char === '!' || char === '?') {
                        delay = 20;
                    } else if (char === ',' || char === ';' || char === ':') {
                        delay = 8;
                    } else if (char === '\n') {
                        delay = 12;
                    } else if (char === ' ') {
                        delay = 1;
                    }

                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                // Finalizar streaming
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMessageId ? {
                        ...msg,
                        content: currentText,
                        streaming: false,
                        pubmedArticles: pubmedArticles
                    } : msg
                ));
                setStreamingMessage('');
                setStreamingMessageId(null);

            } else {
                console.error('❌ Error en respuesta:', response);
                setIsLoading(false);

                const errorMessage = {
                    id: generateUniqueId(),
                    type: 'ai',
                    content: response.error || 'Lo siento, ha ocurrido un error.',
                    timestamp: new Date(),
                    isError: true
                };

                setMessages(prev => [...prev, errorMessage]);
                setError(response.error || 'Error desconocido');
            }
        } catch (error) {
            console.error('💥 Error completo:', error);
            setIsLoading(false);
            incrementUsage(searchType, -1);
            const errorMessage = {
                id: generateUniqueId(),
                type: 'ai',
                content: 'Error de conexión con el servidor.',
                timestamp: new Date(),
                isError: true
            };

            setMessages(prev => [...prev, errorMessage]);
            setError('Error de conexión');
        }
    }, [inputValue, isLoading, currentConversationId, searchType, activeFilters, hasActiveFilters, post, setChatStarted, setMessages, canSendMessage, incrementUsage]);


    // ✅ FUNCIÓN PARA APLICAR FILTROS
    const handleApplyFilters = useCallback((filters) => {
        setActiveFilters(filters);
        console.log('🔧 Filtros aplicados:', filters);
    }, []);

    // ✅ FUNCIÓN PARA CAMBIAR TIPO DE BÚSQUEDA
    const handleSearchTypeChange = useCallback((type) => {
        setSearchType(type);
        console.log('🔍 Tipo de búsqueda cambiado a:', type);
    }, []);

    // Función para generar IDs únicos
    let messageIdCounter = 0;
    const generateUniqueId = () => {
        return `msg_${Date.now()}_${++messageIdCounter}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // ✅ FUNCIÓN PARA CARGAR CONVERSACIÓN ESPECÍFICA
    const loadConversation = useCallback(async (conversationId) => {
        try {
            setConversationsLoading(true);
            console.log('🔄 Cargando conversación:', conversationId);

            const response = await get(`medchat/conversations/${conversationId}`);
            console.log('📥 Respuesta loadConversation:', response);

            if (response.success) {
                // ✅ VERIFICAR QUE response.data EXISTA
                if (response.data.data && response.data.data.conversation) {
                    const { conversation, messages: loadedMessages } = response.data.data;

                    console.log('✅ Conversación cargada:', conversation);
                    console.log('✅ Mensajes cargados:', loadedMessages?.length || 0);

                    setCurrentConversationId(conversation.id);
                    setMessages(loadedMessages || []);
                    setChatStarted(true);

                    // Scroll al final después de cargar
                    setTimeout(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                } else {
                    console.error('❌ Estructura de datos incorrecta:', response.data);
                    setError('Error en la estructura de datos de la conversación');
                }
            } else {
                console.error('❌ Error cargando conversación:', response);
                setError('Error al cargar la conversación');
            }
        } catch (error) {
            console.error('💥 Error cargando conversación:', error);
            setError('Error de conexión al cargar conversación');
        } finally {
            setConversationsLoading(false);
        }
    }, [get, setChatStarted, setMessages]);

    // ✅ FUNCIÓN PARA OBTENER LAS MEJORES PREGUNTAS
    const fetchBestQuestions = useCallback(async () => {
        try {
            setQuestionsLoading(true);
            const response = await get('medchat/best-questions');

            if (response.success) {
                let questions = [];

                if (Array.isArray(response.data.data)) {
                    questions = response.data.data;
                } else if (typeof response.data.data === 'string') {
                    try {
                        questions = JSON.parse(response.data.data);
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                        questions = [];
                    }
                }

                const formattedQuestions = questions.map((q, index) => {
                    if (typeof q === 'string') {
                        return {
                            id: index + 1,
                            question: q,
                            category: index < 2 ? 'general' : 'complex'
                        };
                    }
                    return q;
                });

                setSuggestedQuestions(formattedQuestions);
            } else {
                console.error('Error al obtener preguntas:', response);
                setSuggestedQuestions([
                    { id: 1, question: "¿Cuáles son los síntomas de la hipertensión arterial?", category: "general" },
                    { id: 2, question: "¿Qué es la diabetes tipo 2 y cómo se previene?", category: "general" },
                    { id: 3, question: "Explícame sobre las vacunas COVID-19", category: "complex" },
                    { id: 4, question: "¿Cómo mantener una dieta saludable para el corazón?", category: "complex" }
                ]);
            }
        } catch (error) {
            console.error('Error fetching best questions:', error);
            setSuggestedQuestions([
                { id: 1, question: "¿Cuáles son los síntomas de la hipertensión arterial?", category: "general" },
                { id: 2, question: "¿Qué es la diabetes tipo 2 y cómo se previene?", category: "general" },
                { id: 3, question: "Explícame sobre las vacunas COVID-19", category: "complex" },
                { id: 4, question: "¿Cómo mantener una dieta saludable para el corazón?", category: "complex" }
            ]);
        } finally {
            setQuestionsLoading(false);
        }
    }, [get]);

    // ✅ FUNCIÓN PARA MANEJAR CLICK EN PREGUNTA SUGERIDA
    const handleSuggestedQuestionClick = useCallback((questionText) => {
        setInputValue(questionText);

        setTimeout(() => {
            const fakeEvent = { preventDefault: () => {} };
            handleSubmit(fakeEvent, questionText);
        }, 100);
    }, [handleSubmit]);

// ✅ FUNCIÓN CORREGIDA PARA NUEVO CHAT
    const handleNewChat = useCallback(() => {

        // ✅ LIMPIAR TODOS LOS ESTADOS COMPLETAMENTE
        setMessages([]);
        setChatStarted(false); // ✅ MUY IMPORTANTE - Esto hace que vuelva a mostrar preguntas sugeridas
        setCurrentConversationId(null);
        setError('');
        setStreamingMessage('');
        setStreamingMessageId(null);
        setShouldAutoScroll(true);
        setIsUserScrolling(false);
        setInputValue('');
        setIsLoading(false);
        setConversationsLoading(false); // ✅ AGREGAR ESTO TAMBIÉN

        // ✅ CARGAR PREGUNTAS SUGERIDAS INMEDIATAMENTE
        fetchBestQuestions();
    }, [setChatStarted, setMessages, fetchBestQuestions]);

    // ✅ OTRAS FUNCIONES (sin cambios)
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }, [handleSubmit]);


    const scrollToBottom = useCallback(() => {
        setShouldAutoScroll(true);
        setIsUserScrolling(false);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const handleFilterClick = () => {
        if (!isPremium) {
            // Mostrar modal de upgrade a premium
            alert('Los filtros avanzados son una función exclusiva para usuarios PRO. ¡Actualiza tu cuenta para acceder!');
            return;
        }
        setShowFilterModal(true);
    };

    const handleFutureFeature = (type) => {
        setFutureFeatureType(type);
        setShowFutureModal(true);
    };



    // ✅ EFFECTS
    useEffect(() => {
        if (!chatStarted) {
            fetchBestQuestions();
        }
    }, [chatStarted, fetchBestQuestions]);

    useEffect(() => {
        if (shouldAutoScroll && !isUserScrolling) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length, streamingMessage, shouldAutoScroll, isUserScrolling]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            setIsUserScrolling(true);
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShouldAutoScroll(isNearBottom);

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                setIsUserScrolling(false);
            }, 1000);
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [inputValue]);

    // ✅ EXPONER FUNCIÓN PARA CARGAR CONVERSACIÓN (para el sidebar)
    useEffect(() => {
        // Hacer la función disponible globalmente para el sidebar
        window.loadConversation = loadConversation;

        return () => {
            delete window.loadConversation;
        };
    }, [loadConversation]);

    useEffect(() => {
        // Hacer las funciones disponibles globalmente para el sidebar
        window.loadConversation = loadConversation;
        window.handleNewChat = handleNewChat;

        return () => {
            delete window.loadConversation;
            delete window.handleNewChat;
        };
    }, [loadConversation, handleNewChat]);

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header con información de búsqueda */}
            {chatStarted && (
                <div className="bg-white border-b px-4 py-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <span>Modo: <strong>{
                                searchType === 'simple' ? 'Búsqueda Simple' :
                                    searchType === 'standard' ? 'Búsqueda Web' :
                                        'Investigación Profunda'
                            }</strong></span>
                            {hasActiveFilters() && (
                                <span className="text-green-600">
                                    • Filtros activos
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showLimitWarning && (
                <div className="mx-6 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                        <p className="text-sm text-yellow-800">
                            <strong>Límite alcanzado:</strong> Has usado todos tus mensajes {searchType} por hoy.
                            {userType === 'normal' && (
                                <span className="ml-1">
                                    <a href="/premium" className="text-blue-600 hover:underline">
                                        Actualiza a PRO para mensajes ilimitados
                                    </a>
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            )}

            {/* Error display */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Loading conversation */}
            {conversationsLoading && (
                <div className="flex items-center justify-center p-8">
                    <div className="text-gray-500">Cargando conversación...</div>
                </div>
            )}

            {/* Messages container */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            >
                {!chatStarted && !conversationsLoading && autoLoadAttempted && (
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            ¿En qué puedo ayudarte hoy?
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Haz una pregunta médica o elige una de las sugerencias
                        </p>

                        {/* Suggested questions */}
                        {questionsLoading ? (
                            <div className="text-gray-500">Cargando preguntas sugeridas...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                                {suggestedQuestions.map((q) => (
                                    <button
                                        key={q.id}
                                        onClick={() => handleSuggestedQuestionClick(q.question)}
                                        className="p-4 text-left bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                                    >
                                        <span className="text-gray-800">{q.question}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Messages */}
                {messages.map((message) => (
                    <MessageBubble
                        key={message.id}
                        message={message}
                        streamingMessage={streamingMessageId === message.id ? streamingMessage : null}
                        isLoading={isLoading && message.id === streamingMessageId}
                    />
                ))}

                {/* Thinking loader */}
                {isLoading && (
                    <div className="flex justify-start">
                        <ThinkingLoader message="Recibiendo respuesta en tiempo real..." />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="bg-white border-t p-4">
                <div className="p-6 border-t bg-white">
                    {/* ✅ CONTADOR DE MENSAJES RESTANTES */}
                    {userType === 'premium' || userType === 'admin' ? (
                        <div className="flex items-center justify-center space-x-4 text-xs">
                <span className="text-green-600 font-medium flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Usuario {userType === 'admin' ? 'Admin' : 'Premium'}
                </span>
                            {getRemainingMessages(searchType) === -1 ? (
                                <span className="text-blue-600">
                        Mensajes {searchType}: <strong>Ilimitados</strong>
                    </span>
                            ) : (
                                <span className="text-blue-600">
                        Mensajes {searchType}: <strong>{getRemainingMessages(searchType)} restantes</strong>
                    </span>
                            )}
                            {resetInfo && (
                                <span className="text-gray-500">
                        Reset: {resetInfo.days_until_reset} días
                    </span>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center space-x-4 text-xs">
                <span className="text-orange-600 font-medium flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Usuario Normal
                </span>
                            <span className="text-gray-600">
                    Mensajes {searchType}: <strong>{getRemainingMessages(searchType)} restantes</strong>
                </span>
                            {resetInfo && (
                                <span className="text-gray-500">
                        Reset: {resetInfo.days_until_reset} días
                    </span>
                            )}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
                        {/* Search Type Selector y Filter Button */}
                        <SearchTypeSelector
                            selectedType={searchType}
                            onTypeChange={handleSearchTypeChange}
                            onFilterClick={() => setShowFilterModal(true)}
                            hasActiveFilters={hasActiveFilters()}
                        />

                        {/* Text input */}
                        <div className="flex-1">
                            <textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu pregunta médica aquí..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="1"
                                style={{ minHeight: '48px', maxHeight: '120px' }}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Send button */}
                        <button
                            type="button"
                            onClick={() => handleFutureFeature('attachment')}
                            className="flex-shrink-0 p-3 text-gray-400 hover:text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                            title="Adjuntar archivo (Próximamente)"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            <Send size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFutureFeature('voice')}
                            className="flex-shrink-0 p-3 text-gray-400 hover:text-gray-600 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                            title="Mensaje de voz (Próximamente)"
                        >
                            <Mic className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            {/* ✅ MODALES */}
            <FilterModal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                onApplyFilters={handleApplyFilters}
                initialFilters={activeFilters}
            />

            <FutureFeatureModal
                isOpen={showFutureModal}
                onClose={() => setShowFutureModal(false)}
                featureType={futureFeatureType}
            />
        </div>
    );
};

export default ChatInterface;
