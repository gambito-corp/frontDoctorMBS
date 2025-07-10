import { useEffect, useState } from "react";
import AuthLayout from "../../Layout/AuthLayout";
import { useAuth } from '../../../hooks/useAuth';
import { useApi } from '../../../hooks/useApi';

export default function VerifyEmail() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const { refreshUser, checkAuthAndRedirect } = useAuth();
    const { get } = useApi();

    useEffect(() => {
        (async () => {
            await refreshUser();
            await checkAuthAndRedirect("/dashboard", "/verify-email");
        })();
    }, [refreshUser, checkAuthAndRedirect]);

    const handleResend = async () => {
        try {
            setLoading(true);
            const response = await get('auth/me');
            if (response.success) {
                setStatus("success");
                setLoading(false);
            }
        }catch (error) {
            console.error('Error al reenviar el correo de verificación:', error);
            setStatus("error");
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="max-w-md w-full p-8 bg-white rounded-md">
                <div className="flex justify-center mb-6">
                    <img src="https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/mbs-logo.svg" alt="MBS Logo" className="h-10" />
                </div>
                <p className="text-sm text-gray-600 mb-6">
                    Antes de continuar, ¿podrías verificar tu dirección de correo electrónico haciendo clic en el enlace que te acabamos de enviar?
                    Si no lo has recibido, con gusto te enviaremos otro.
                </p>
                {status === "success" && (
                    <p className="text-sm text-green-600 mb-4">
                        Se ha enviado un nuevo enlace de verificación a tu dirección de correo electrónico.
                    </p>
                )}
                {status === "error" && (
                    <p className="text-sm text-red-600 mb-4">
                        Hubo un problema al reenviar el correo. Intenta de nuevo más tarde.
                    </p>
                )}
                <button
                    onClick={handleResend}
                    disabled={loading}
                    className="bg-[#0d3a54] hover:bg-[#093043] text-white font-bold py-2 px-4 rounded"
                >
                    {loading ? "Enviando..." : "REENVIAR CORREO DE VERIFICACIÓN"}
                </button>
            </div>
        </AuthLayout>
    );
}
