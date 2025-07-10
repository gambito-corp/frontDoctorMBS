// src/utils/getUserType.js
export function getUserType(user) {
    if (!user) return 'freemium';
    const roles = user.roles || [];
    if (roles.includes('root')) return 'root';
    if (roles.includes('rector')) return 'rector';
    if (roles.includes('estudiante')) return 'estudiante';
    if (user.status === 1 || roles.includes('pro')) return 'pro';
    return 'freemium';
}