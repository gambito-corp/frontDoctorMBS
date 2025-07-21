// src/utils/getUserType.js
export function getUserType(user) {
    if (!user) return 'freemium';
    const roles = user.roles || [];
    if (roles.includes('root')) return 'root';
    if (roles.includes('rector')) return 'rector';
    if (user.is_pro === 1 || roles.includes('pro')) return 'pro';
    if (roles.includes('estudiante')) return 'estudiante';
    return 'freemium';
}