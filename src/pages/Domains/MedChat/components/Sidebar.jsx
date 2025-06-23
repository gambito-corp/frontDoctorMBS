// src/pages/Domains/MedChat/components/Sidebar.jsx

import React, { useState } from 'react';
import { useConversations } from '../../../../hooks/useConversations';

const Sidebar = ({ isOpen, onToggle, currentConversationId, onLoadConversation, onNewChat }) => {
    const {
        conversations,
        loading,
        error,
        fetchConversations,
        updateConversationTitle,
        deleteConversation
    } = useConversations();

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    // ✅ VERIFICAR QUE conversations SEA UN ARRAY ANTES DE USAR
    const safeConversations = Array.isArray(conversations) ? conversations : [];

    // Agrupar conversaciones por fecha
    const groupConversationsByDate = (conversations) => {
        // ✅ VERIFICACIÓN ADICIONAL
        if (!Array.isArray(conversations)) {
            console.warn('⚠️ groupConversationsByDate recibió:', conversations);
            return {
                'ÚLTIMOS': [],
                'ÚLTIMOS 7 DÍAS': [],
                'ÚLTIMOS 30 DÍAS': [],
                'ÚLTIMO AÑO': []
            };
        }
        const now = new Date();
        const groups = {
            'ÚLTIMOS': [],
            'ÚLTIMOS 7 DÍAS': [],
            'ÚLTIMOS 30 DÍAS': [],
            'ÚLTIMO AÑO': []
        };

        conversations.forEach(conv => {
            const convDate = new Date(conv.updated_at);
            const diffTime = Math.abs(now - convDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
                groups['ÚLTIMOS'].push(conv);
            } else if (diffDays <= 7) {
                groups['ÚLTIMOS 7 DÍAS'].push(conv);
            } else if (diffDays <= 30) {
                groups['ÚLTIMOS 30 DÍAS'].push(conv);
            } else {
                groups['ÚLTIMO AÑO'].push(conv);
            }
        });

        return groups;
    };

    const groupedConversations = groupConversationsByDate(safeConversations); // ✅ USAR safeConversations

    const handleEditStart = (conversation) => {
        setEditingId(conversation.id);
        setEditTitle(conversation.title);
    };

    const handleEditSave = async (conversationId) => {
        if (editTitle.trim() && editTitle.trim() !== conversations.find(c => c.id === conversationId)?.title) {
            await updateConversationTitle(conversationId, editTitle.trim());
        }
        setEditingId(null);
        setEditTitle('');
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditTitle('');
    };

    const handleDelete = async (conversationId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
            const success = await deleteConversation(conversationId);
            if (success && conversationId === currentConversationId) {
                onNewChat();
            }
        }
    };

    const renderConversationItem = (conversation) => {
        const isActive = conversation.id === currentConversationId;
        const isEditing = editingId === conversation.id;

        return (
            <div
                key={conversation.id}
                className={`group flex items-center justify-between px-3 py-2 mx-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
                }`}
                onClick={() => !isEditing && onLoadConversation(conversation.id)}
            >
                {/* Icono de chat */}
                <div className="flex items-center flex-1 min-w-0">
                    <svg className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>

                    {/* Título editable */}
                    {isEditing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleEditSave(conversation.id)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleEditSave(conversation.id);
                                } else if (e.key === 'Escape') {
                                    handleEditCancel();
                                }
                            }}
                            className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    ) : (
                        <span className="text-sm text-gray-700 truncate flex-1">
                            {conversation.title}
                        </span>
                    )}
                </div>

                {/* Botones de acción */}
                {!isEditing && (
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditStart(conversation);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Editar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(conversation.id);
                            }}
                            className="p-1 ml-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Eliminar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderGroup = (title, conversations) => {
        if (conversations.length === 0) return null;

        return (
            <div key={title} className="mb-4">
                {/* Header del grupo colapsable */}
                <div className="flex items-center px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {title}
                </div>

                {/* Lista de conversaciones */}
                <div className="space-y-1">
                    {conversations.map(renderConversationItem)}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:relative lg:translate-x-0`}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
                    <button
                        onClick={onNewChat}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                        Nuevo Chat
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* Lista de conversaciones */}
                <div className="flex-1 overflow-y-auto py-2">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 px-4">
                            <p className="text-red-600 text-sm mb-2">{error}</p>
                            <button
                                onClick={fetchConversations}
                                className="text-teal-600 text-sm hover:underline"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : safeConversations.length === 0 ? (
                        <div className="text-center py-8 px-4">
                            <p className="text-gray-500 text-sm mb-2">No hay conversaciones aún</p>
                            <button
                                onClick={onNewChat}
                                className="text-teal-600 text-sm hover:underline"
                            >
                                Crear primera conversación
                            </button>
                        </div>
                        ) : (
                        <div>
                        {renderGroup('ÚLTIMOS', groupedConversations['ÚLTIMOS'])}
                        {renderGroup('ÚLTIMOS 7 DÍAS', groupedConversations['ÚLTIMOS 7 DÍAS'])}
                        {renderGroup('ÚLTIMOS 30 DÍAS', groupedConversations['ÚLTIMOS 30 DÍAS'])}
                        {renderGroup('ÚLTIMO AÑO', groupedConversations['ÚLTIMO AÑO'])}
                    </div>
                    )}
                </div>

                {/* Botón para cerrar en móvil */}
                <button
                    onClick={onToggle}
                    className="lg:hidden p-4 text-gray-500 hover:text-gray-700 border-t border-gray-200"
                >
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </>
    );
};

export default Sidebar;
