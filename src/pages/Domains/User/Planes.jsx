// src/pages/Domains/User/Plans.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../hooks/useApi';

export default function Plans() {
    const { get }          = useApi();
    const navigate         = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    /* 1️⃣  Descarga de planes una sola vez */
    useEffect(() => {
        (async () => {
            const { success, data } = await get('subscriptions/plans');   // <─ endpoint GET
            if (success) setPlans(data);
            setLoading(false);
        })();
    }, []);

    /* 2️⃣  Acción al clicar un plan */
    const handleSelect = (plan) => {
        // abre la URL del plan (Mercado Pago, WhatsApp, etc.)
        if (plan.url) {
            window.location.href = plan.url;            // redirección externa
            return;
        }
        // fallback: checkout interno por nombre
        navigate('/suscripcion/checkout', { state: { plan: plan.name } });
    };

    /* 3️⃣  Derivados visuales */
    const isDisabled  = (plan) => Number(plan.price) === 0;               // ejemplo
    const isHighlight = (plan) => plan.duration_days >= 180;              // ejemplo

    /* 4️⃣  UI */
    if (loading) {
        return (
            <div className="flex justify-center mt-20">
                <span className="animate-pulse text-gray-500">Cargando planes…</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-12">
            <h1 className="text-3xl font-bold text-[#0d3a54] mb-2">Elige tu plan</h1>
            <p className="mb-10 text-gray-600">
                Mejora tu experiencia y desbloquea todo el potencial de DoctorMBS
            </p>

            <div className="flex flex-col md:flex-row gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`flex-1 bg-white rounded-xl shadow-lg border-2 p-8 flex flex-col transition-transform duration-300
                        ${isHighlight(plan) ? 'border-yellow-400 scale-105' : 'border-gray-200'}`}
                    >
                        <h2
                            className={`text-2xl font-bold mb-2 ${
                                isHighlight(plan) ? 'text-yellow-600' : 'text-[#0d3a54]'
                            }`}
                        >
                            {plan.name}
                        </h2>

                        <div className="flex items-end mb-4">
                            <span className="text-4xl font-extrabold">S/ {plan.price}</span>
                            {plan.duration_days && (
                                <span className="text-gray-500 ml-1">
                  /{plan.duration_days >= 30 ? `${plan.duration_days / 30} mes` : `${plan.duration_days} días`}
                </span>
                            )}
                        </div>

                        <p className="text-gray-700 text-sm mb-6">{plan.description}</p>

                        <button
                            disabled={isDisabled(plan)}
                            onClick={() => handleSelect(plan)}
                            className={`mt-auto py-2 px-6 rounded-lg font-semibold transition-colors
                ${isDisabled(plan)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : isHighlight(plan)
                                    ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
                                    : 'bg-[#0d3a54] hover:bg-[#093043] text-white'}`}
                        >
                            {isDisabled(plan) ? 'Tu plan actual' : 'Seleccionar'}
                        </button>

                        {isHighlight(plan) && (
                            <div className="mt-4 text-xs text-yellow-700 font-bold text-center">
                                ¡Más popular!
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
