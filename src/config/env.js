// src/config/env.js
const requiredEnvVars = [
    'REACT_APP_API_BASE_URL',
    'REACT_APP_LOGIN_URL',
    'REACT_APP_GET_TOKEN_ENDPOINT',
    'REACT_APP_TOKEN_STORAGE_KEY'
];

// Verificar que todas las variables requeridas estén definidas
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        throw new Error(`Variable de entorno requerida no encontrada: ${envVar}`);
    }
});

export const config = {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
    loginUrl: process.env.REACT_APP_LOGIN_URL,
    getTokenEndpoint: process.env.REACT_APP_GET_TOKEN_ENDPOINT,
    tokenStorageKey: process.env.REACT_APP_TOKEN_STORAGE_KEY,
    tokenName: process.env.REACT_APP_TOKEN_NAME
};
