// src/components/Sidebar/Sidebar.jsx
import { useState } from 'react';
import { Button } from '@gambito-corp/mbs-library';

const dummyChats = {
    'ÚLTIMOS': [{ id: 1, title: 'Nuevo Chat 06/06' }],
    'ÚLTIMOS 7 DÍAS': [{ id: 2, title: 'Dependencias Dock…' }],
    'ÚLTIMOS 30 DÍAS': [
        { id: 3, title: 'Acondroplasia: ge…' },
        { id: 4, title: 'Nuevo Chat 16/05' },
    ],
};

export default function Sidebar({ onCloseMobile }) {
    const [openGroups, setOpenGroups] = useState(() => {
        const initial = {};
        Object.keys(dummyChats).forEach((key) => (initial[key] = true));
        return initial;
    });

    const toggleGroup = (group) => {
        setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
    };

    const handleChatClick = () => {
        if (window.innerWidth < 640 && onCloseMobile) {
            onCloseMobile(); // Cierra el sidebar en móvil
        }
    };

    return (
        <div className="h-screen bg-white border-r border-gray-200 p-4">
            <div className="mb-4">
                <Button className="w-full">
                    Nuevo Chat
                </Button>
            </div>

            <div className="space-y-4">
                {Object.entries(dummyChats).map(([groupName, chats]) => (
                    <div key={groupName}>
                        <button
                            onClick={() => toggleGroup(groupName)}
                            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            <span>{groupName}</span>
                            <svg
                                className={`w-4 h-4 transition-transform ${openGroups[groupName] ? 'rotate-90' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {openGroups[groupName] && (
                            <div className="mt-2 ml-4 space-y-1">
                                {chats.map((chat) => (
                                    <button
                                        key={chat.id}
                                        onClick={handleChatClick}
                                        className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded px-2 py-1"
                                    >
                                        {chat.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
