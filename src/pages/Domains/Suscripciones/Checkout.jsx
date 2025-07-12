// src/pages/Domains/Suscripciones/Checkout.jsx
import { useState } from 'react';
import {
    CardNumber,
    ExpirationDate,
    SecurityCode,
    createCardToken,
} from '@mercadopago/sdk-react';
import { useLocation } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';

/* Wrapper reutilizable para cada Secure Field  ------------------------ */
const MPField = ({ children, label }) => (
    <label className="block">
        <span className="text-sm text-gray-700">{label}</span>
        <div
            className="relative border rounded h-11 w-full focus-within:ring-2
                    focus-within:ring-[#0d3a54] mt-1"
        >
            {/* capa de padding visual (no intercepta el clic) */}
            <div className="absolute inset-0 px-3 py-2 pointer-events-none" />
            {/* iframe de Mercado Pago */}
            {children}
        </div>
    </label>
);

export default function Checkout() {
    const { state } = useLocation(); // { plan: 'Premium Mensual' }
    const { post, loading } = useApi();

    const [form, setForm] = useState({
        name: '',
        docType: 'DNI',
        docNumber: '',
        email: '',
    });
    const [error, setError] = useState(null);

    /* --------------------------- handlers -------------------------------- */
    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            /* 1️⃣ Tokenizar tarjeta */
            const cardToken = await createCardToken({
                cardholderName: form.name,
                identificationType: form.docType,
                identificationNumber: form.docNumber,
            });

            if (!cardToken?.id) {
                throw new Error('No se pudo generar el token de la tarjeta. Revisa los datos.');
            }

            /* 2️⃣ Crear suscripción */
            const { success, data, error: apiErr } = await post('/subscriptions', {
                use_plan: true,
                plan_name: state?.plan ?? 'Premium Mensual',
                freq: state?.plan?.includes('Semestral') ? 6 : 1,
                amount: state?.plan?.includes('Semestral') ? 49.99 : 9.99,
                card_token: cardToken.id,
                email: form.email,
            });

            if (!success) throw new Error(apiErr || 'Error al suscribirse');

            /* 3️⃣ Redirigir al init_point o dashboard */
            window.location.href = data.init_point ?? '/dashboard';
        } catch (err) {
            setError(err.message);
        }
    };

    /* --------------------------- UI ------------------------------------- */
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-lg bg-white rounded shadow p-8">
                <h2 className="text-2xl font-bold text-center text-[#0d3a54] mb-6">
                    Suscripción {state?.plan}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4" id="form-checkout">
                    {/* Email */}
                    <label className="block">
                        <span className="text-sm text-gray-700">E-mail del titular</span>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full border rounded px-3 py-2
                         focus:ring-[#0d3a54] focus:border-[#0d3a54]"
                            placeholder="juan.perez@example.com"
                        />
                    </label>

                    {/* Titular */}
                    <label className="block">
                        <span className="text-sm text-gray-700">Nombre del titular</span>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full border rounded px-3 py-2
                         focus:ring-[#0d3a54] focus:border-[#0d3a54]"
                            placeholder="Como figura en la tarjeta"
                        />
                    </label>

                    {/* Documento */}
                    <div className="flex gap-3">
                        <label className="flex-1">
                            <span className="text-sm text-gray-700">Tipo doc.</span>
                            <select
                                name="docType"
                                value={form.docType}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded px-3 py-2 h-11
                           focus:ring-[#0d3a54] focus:border-[#0d3a54]"
                            >
                                <option>DNI</option>
                                <option>CE</option>
                                <option>RUC</option>
                            </select>
                        </label>

                        <label className="flex-1">
                            <span className="text-sm text-gray-700">Nº documento</span>
                            <input
                                name="docNumber"
                                value={form.docNumber}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full border rounded px-3 py-2
                           focus:ring-[#0d3a54] focus:border-[#0d3a54]"
                                placeholder="12345678"
                            />
                        </label>
                    </div>

                    {/* Secure Fields ------------------------------------------------ */}
                    <MPField label="Número de la tarjeta">
                        <CardNumber
                            options={{ placeholder: '0000 0000 0000 0000' }}
                            style={{ iframe: { width: '100%', height: '100%' } }}
                        />
                    </MPField>

                    <div className="flex gap-3">
                        <MPField label="Vencimiento">
                            <ExpirationDate
                                options={{ placeholder: 'MM/YY' }}
                                style={{ iframe: { width: '100%', height: '100%' } }}
                            />
                        </MPField>

                        <MPField label="CVV">
                            <SecurityCode
                                options={{ placeholder: '123' }}
                                style={{ iframe: { width: '100%', height: '100%' } }}
                            />
                        </MPField>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0d3a54] hover:bg-[#093043] text-white
                       font-semibold py-2 rounded"
                    >
                        {loading ? 'Procesando…' : 'Suscribirme'}
                    </button>
                </form>
            </div>
        </div>
    );
}
