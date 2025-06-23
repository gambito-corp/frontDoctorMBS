import { useEffect, useState } from "react";
import AuthLayout from "../../Layout/AuthLayout";
import axios from "axios";

export default function VerifyEmail() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_BASE_URL;
    const tokenKey = process.env.REACT_APP_TOKEN_STORAGE_KEY || "tokenKey";

    const handleResend = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem(tokenKey);
            if (!token) {
                setStatus("error");
                console.error("Token no disponible.");
                return;
            }

            const response = await axios.post(
                `${API_URL}auth/resend-verification-email`,
                {},
                {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 202) {
                setStatus("success");
            }
        } catch (error) {
            console.error("Error al reenviar email:", error);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="max-w-md w-full p-8 bg-white rounded-md">
                <div className="w-full max-w-md">
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
            </div>
        </AuthLayout>
    );
}
