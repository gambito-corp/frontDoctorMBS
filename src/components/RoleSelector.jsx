// src/components/RoleSelector.jsx - NUEVO COMPONENTE

import React, { useState } from 'react';
import { usePremiumAccess } from '../hooks/usePremiumAccess';

const RoleSelector = () => {
    const { isRoot, user, changeDebugRole } = usePremiumAccess();
    const [selectedRole, setSelectedRole] = useState('auto');

    // Solo mostrar para usuarios ROOT
    if (!isRoot) return null;

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        setSelectedRole(newRole);

        if (newRole !== 'auto') {
            const confirmed = window.confirm(
                `¿Estás seguro de cambiar a rol "${newRole}"?\n\nEsto recargará la página.`
            );

            if (confirmed) {
                changeDebugRole(newRole);
            } else {
                setSelectedRole('auto'); // Revertir selección
            }
        }
    };

    const getCurrentRoleDisplay = () => {
        if (!user || !user.roles) return 'Sin rol';

        if (user.roles.includes('root')) return 'ROOT';
        if (user.roles.includes('rector')) return 'RECTOR';
        if (user.is_pro) return 'PRO';
        return 'NORMAL';
    };

    return (
        <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-xs font-medium text-red-700">🔧 ROOT:</span>
            <select
                value={selectedRole}
                onChange={handleRoleChange}
                className="text-xs border border-red-300 rounded px-2 py-1 bg-white focus:ring-1 focus:ring-red-500 focus:border-red-500"
            >
                <option value="auto">Auto ({getCurrentRoleDisplay()})</option>
                <option value="normal">👤 Normal</option>
                <option value="pro">⭐ PRO</option>
                <option value="root">👑 ROOT</option>
                <option value="rector">🎓 RECTOR</option>
            </select>
        </div>
    );
};

export default RoleSelector;
