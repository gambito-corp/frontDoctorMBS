import { useState } from 'react';
import { Input } from '@gambito-corp/mbs-library';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../Layout/AuthLayout';
import axios from 'axios';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const API_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setStatus(null);
        setLoading(true);

        try {
            const response = await axios.get(`${API_URL}auth/forgot-password`, {
                params: {
                    email,
                },
                headers: {
                    "Accept": "application/json",
                },
            });

            if (response.status === 200) {
                setStatus("success");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error al enviar el correo.");
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="max-w-md w-full p-8 bg-white rounded-md text-center">
                <img src="https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/mbs-logo.svg" alt="Logo" className="h-10 mx-auto mb-6" />
                <p className="text-gray-600 mb-6 text-sm">
                    ¿Olvidaste tu contraseña? No hay problema. Déjanos tu correo electrónico y te enviaremos un enlace para restablecerla.
                </p>

                {status === "success" && (
                    <p className="mb-4 text-sm text-green-600 bg-green-100 p-2 rounded">
                        Te hemos enviado un enlace para restablecer tu contraseña.
                    </p>
                )}

                {status === "error" && (
                    <p className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-left">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#0d3a54] text-white font-bold px-4 py-2 rounded-md hover:bg-[#093043]"
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "ENVIAR ENLACE PARA RESTABLECER CONTRASEÑA"}
                    </button>

                    <div className="mt-4 text-sm">
                        <Link
                            to="/login"
                            className="cursor-pointer text-[#0d3a54] underline hover:text-[#093043]"
                        >
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
