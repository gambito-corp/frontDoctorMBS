// src/pages/Domains/MedChat/components/ChatInterface.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApi } from '../../../../hooks/useApi';
import { useSSEStream } from '../../../../hooks/useSSEStream';
import MessageBubble from './MessageBubble';
import ThinkingLoader from "./ThinkingLoader";

const ChatInterface = ({ chatStarted, setChatStarted, messages, setMessages, sidebarCollapsed, autoLoadAttempted = false}) => {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');
    const [streamingMessageId, setStreamingMessageId] = useState(null);
    const [error, setError] = useState('');
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);

    // ✅ NUEVOS ESTADOS PARA PERSISTENCIA
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [conversationsLoading, setConversationsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    const { post, get } = useApi();
    const { startStream, stopStream, isStreaming } = useSSEStream();

    // ✅ FUNCIÓN PARA GENERAR IDS ÚNICOS
    let messageIdCounter = 0;
    const generateUniqueId = () => {
        return `msg_${Date.now()}_${++messageIdCounter}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // ✅ FUNCIÓN HANDLESUBMIT MODIFICADA PARA PERSISTENCIA
    const handleSubmit = useCallback(async (e, customText = null) => {
        e.preventDefault();

        const textToSend = customText || inputValue.trim();
        if (!textToSend || isLoading) {
            console.error('❌ Envío bloqueado - input vacío o cargando');
            return;
        }

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
            const requestData = {
                question: textToSend,
                conversation_id: currentConversationId,
                chat_history: []
            };
            const response = await post('medchat/ask', requestData);
            if (response.success) {
                // ✅ ESTRUCTURA CORREGIDA CON 3 DATA
                const aiResponse = response.data.data.data.answer;
                const pubmedArticles = response.data.data.data.pubmed_articles || [];
                const conversationId = response.data.data.conversation_id;
                // ✅ ACTUALIZAR ID DE CONVERSACIÓN SI ES NUEVA
                if (!currentConversationId && conversationId) {
                    setCurrentConversationId(conversationId);
                }

                // ✅ VERIFICAR QUE NO ESTÉ VACÍO
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
                    pubmedArticles: pubmedArticles
                };

                setStreamingMessageId(aiMessageId);
                setMessages(prev => [...prev, aiMessage]);
                setIsLoading(false);


                // ✅ EFECTO DE MÁQUINA DE ESCRIBIR CON MÁS DEBUGGING
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


                // ✅ FINALIZAR STREAMING
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
    }, [inputValue, isLoading, currentConversationId, post, setChatStarted, setMessages]);

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

    const handleStopStream = useCallback(() => {
        stopStream();
        setIsLoading(false);
        setStreamingMessage('');
        setStreamingMessageId(null);
    }, [stopStream]);

    const scrollToBottom = useCallback(() => {
        setShouldAutoScroll(true);
        setIsUserScrolling(false);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

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

    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            stopStream();
        };
    }, [stopStream]);

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
        <div className="flex flex-col h-full bg-white">
            {/* Error Message */}
            {error && (
                <div className="flex-shrink-0 bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading de conversaciones */}
            {conversationsLoading && (
                <div className="flex-shrink-0 bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4 rounded">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                        <p className="text-sm text-blue-700">Cargando conversación...</p>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.length === 0 && !chatStarted && (
                    <div className="text-center py-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Haz una pregunta sobre medicina, síntomas, tratamientos o cualquier tema de salud
                            </h2>
                            <p className="text-gray-600">
                                Recibiendo respuesta en tiempo real...
                            </p>
                        </div>

                        {/* Preguntas Sugeridas */}
                        {questionsLoading ? (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : suggestedQuestions.length > 0 && (
                            <div className="max-w-2xl mx-auto">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">
                                    Preguntas sugeridas:
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {suggestedQuestions.slice(0, 4).map((question) => (
                                        <button
                                            key={question.id}
                                            onClick={() => handleSuggestedQuestionClick(question.question)}
                                            className="p-3 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 group"
                                        >
                                            <div className="flex items-start">
                                                <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                                    {question.question}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {messages.map((message) => (
                    <MessageBubble
                        key={message.id}
                        message={message}
                        streamingMessage={message.id === streamingMessageId ? streamingMessage : null}
                    />
                ))}

                {isLoading && !streamingMessage && (
                    <div className="flex justify-start">
                        <ThinkingLoader />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe tu pregunta médica aquí..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                            rows="1"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>

                        {isStreaming && (
                            <button
                                type="button"
                                onClick={handleStopStream}
                                className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
