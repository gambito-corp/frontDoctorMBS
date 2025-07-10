import React from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
    {
        name: "Freemium",
        price: "0€",
        period: "",
        features: [
            "Acceso a preguntas seleccionadas",
            "Progreso limitado",
            "Soporte básico",
            "Acceso a DoctorMBS limitado",
        ],
        cta: "Tu plan actual",
        disabled: true,
        highlight: false,
    },
    {
        name: "Premium Mensual",
        price: "9,99€",
        period: "/mes",
        features: [
            "Acceso ilimitado a todas las preguntas",
            "Progreso y estadísticas avanzadas",
            "Soporte prioritario",
            "Acceso completo a DoctorMBS",
            "Actualizaciones premium",
        ],
        cta: "Elegir mensual",
        disabled: false,
        highlight: false,
    },
    {
        name: "Premium Semestral",
        price: "49,99€",
        period: "/6 meses",
        features: [
            "Todo lo de Premium Mensual",
            "6 meses por el precio de 5",
            "Regalo exclusivo para suscriptores",
        ],
        cta: "Elegir semestral",
        disabled: false,
        highlight: true,
    },
];

export default function Planes() {
    const navigate = useNavigate();

    const handleSelect = (plan) => {
        // Aquí puedes pasar el tipo de plan a la página de pagos si lo necesitas
        if (!plan.disabled) {
            navigate('/pagos', { state: { plan: plan.name } });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-12">
            <h1 className="text-3xl font-bold text-[#0d3a54] mb-2">Elige tu plan</h1>
            <p className="mb-10 text-gray-600">Mejora tu experiencia y desbloquea todo el potencial de DoctorMBS</p>
            <div className="flex flex-col md:flex-row gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`flex-1 bg-white rounded-xl shadow-lg border-2 p-8 flex flex-col transition-transform duration-300
                            ${plan.highlight ? 'border-yellow-400 scale-105' : 'border-gray-200'}
                        `}
                    >
                        <h2 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-yellow-600' : 'text-[#0d3a54]'}`}>
                            {plan.name}
                        </h2>
                        <div className="flex items-end mb-4">
                            <span className="text-4xl font-extrabold">{plan.price}</span>
                            <span className="text-gray-500 ml-1">{plan.period}</span>
                        </div>
                        <ul className="mb-6 space-y-2">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-gray-700">
                                    <span className="mr-2 text-green-500">✔️</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            disabled={plan.disabled}
                            onClick={() => handleSelect(plan)}
                            className={`mt-auto py-2 px-6 rounded-lg font-semibold transition-colors
                                ${plan.disabled
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : plan.highlight
                                    ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
                                    : 'bg-[#0d3a54] hover:bg-[#093043] text-white'
                            }
                            `}
                        >
                            {plan.cta}
                        </button>
                        {plan.highlight && (
                            <div className="mt-4 text-xs text-yellow-700 font-bold text-center">¡Más popular!</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
