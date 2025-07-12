import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './mp.css';
import './utils/fontawesome';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initMercadoPago } from '@mercadopago/sdk-react';

initMercadoPago(process.env.REACT_APP_MP_PUBLIC_KEY); // usa tu clave pública



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
reportWebVitals();
