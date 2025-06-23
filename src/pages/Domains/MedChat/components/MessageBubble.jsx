// src/pages/Domains/MedChat/components/MessageBubble.jsx
import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import PubMedArticles from './PubMedArticles';

const MessageBubble = ({ message, streamingMessage, isLoading = false}) => { // ✅ CAMBIAR streamingText por streamingMessage
    const isUser = message.type === 'user';
    const [showPubMed, setShowPubMed] = useState(false);

    // ✅ SIMPLIFICAR LA LÓGICA
    const displayContent = streamingMessage || message.content;
    const isCurrentlyStreaming = !!streamingMessage;

    const pubmedArticles = message.pubmedArticles || [];

    useEffect(() => {
        if (!isCurrentlyStreaming && !isUser && pubmedArticles.length > 0 && !message.streaming) {
            const timer = setTimeout(() => {
                setShowPubMed(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isCurrentlyStreaming, isUser, pubmedArticles.length, message.streaming]);

    const renderContent = () => {
        if (isUser) {
            return (
                <div className="text-white">
                    {displayContent}
                </div>
            );
        }

        // Para mensajes de IA
        return (
            <div className="text-gray-900">
                <div
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(displayContent || '')
                    }}
                />
                {isCurrentlyStreaming && (
                    <span className="inline-block w-2 h-5 bg-blue-600 ml-1 animate-pulse">|</span>
                )}
            </div>
        );
    };

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs lg:max-w-2xl px-4 py-2 rounded-lg ${
                isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
            }`}>
                {renderContent()}

                {/* Mostrar artículos de PubMed solo para mensajes de IA */}
                {!isUser && showPubMed && pubmedArticles.length > 0 && (
                    <div className="mt-4">
                        <PubMedArticles articles={pubmedArticles} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
