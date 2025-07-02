// src/pages/Domains/MedBank/components/StandardExamConfig/TabNavigation.jsx
import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab.name}
                        {tab.count > 0 && (
                            <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default TabNavigation;
