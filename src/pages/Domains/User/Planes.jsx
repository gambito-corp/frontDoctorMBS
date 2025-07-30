import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MercadoPagoCardForm from '../../../components/MercadoPagoCardForm'; // según donde lo tengas

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const plan = location.state?.plan;

    if (!plan) {
        return <div>No se ha seleccionado ningún plan.</div>;
    }

    const handleTokenGenerated = async (formData) => {
        const payload = {
            plan_id: plan.id,
            payer_email: formData.cardholderEmail,
            card_token_id: formData.token,
            external_reference: 'ID_DE_USUARIO_LOGUEADO_O_UNIQUE', // Ajusta según auth y contexto
        };

        try {
            const res = await fetch('/api/subscriptions/pagos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (res.ok) {
                // Redirigir a éxito o mostrar mensaje de gracias
                navigate('/suscripcion/exito');
            } else {
                alert('Error al crear la suscripción: ' + (data.message || 'Error desconocido'));
            }
        } catch (error) {
            alert('Error de red al crear la suscripción');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen py-12 flex flex-col items-center bg-gray-50">
            <h1 className="text-2xl font-bold mb-4 text-[#0d3a54]">
                Suscribirse: {plan.name} - S/ {plan.price}
            </h1>
            <MercadoPagoCardForm amount={plan.price} onTokenGenerated={handleTokenGenerated} />
        </div>
    );
}
