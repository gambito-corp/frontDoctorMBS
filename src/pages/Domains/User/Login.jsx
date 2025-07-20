import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from '@gambito-corp/mbs-library';
import AuthLayout from '../../Layout/AuthLayout';
import {
    setAccessToken,
    setRefreshToken,
    setUser,
} from '../../../utils/tokens';
import { useAuth } from '../../../hooks/useAuth';
import { useApi } from '../../../hooks/useApi';

export default function Login() {
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location   = useLocation();
    const { checkAuthAndRedirect, isValid } = useAuth();
    const { post } = useApi();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const msg = params.get("warning");
        if (msg) {
            setWarning(decodeURIComponent(msg));
            params.delete("warning");
            navigate({ search: params.toString() }, { replace: true });
        }
    }, [location.search]);
    /* ───────────────────────────────────────────────────────────────────────── */

    useEffect(() => {
        checkAuthAndRedirect();
    }, [checkAuthAndRedirect]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        const { success, data, error: apiError } = await post(
            `${process.env.REACT_APP_API_BASE_URL}auth/login`,
            { email, password },
            { headers: { "Content-Type": "application/json" } }
        );

        if (success) {
            setAccessToken(data.access_token);
            setRefreshToken(data.refresh_token);
            setUser(data.user);

            if (!isValid(data.user.email_verified_at)) {
                navigate("/login");
            } else {
                navigate("/dashboard", { replace: true });
            }
        } else {
            setError(apiError || "Error al conectar con el servidor.");
        }
        setIsLoading(false);
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className="max-w-md w-full p-8 bg-white rounded-md">
                <div className="flex justify-center mb-6">
                    <img src="https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/mbs-logo.svg" alt="Logo" className="h-10" />
                </div>
                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
                        {error}
                    </div>
                )}
                {warning && (
                    <div className="mb-4 text-sm text-yellow-800 bg-yellow-100 p-2 rounded">
                        {warning}
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                    <Input type="email" name="email" id="email" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <Input type="password" name="password" id="password" required />
                </div>
                <div className="flex justify-between items-center">
                    <Link
                        to="/register"
                        className="text-sm font-bold text-[#0d3a54] border border-[#0d3a54] px-4 py-2 rounded-md hover:bg-[#0d3a54] hover:text-white"
                    >
                        Regístrate ahora
                    </Link>
                    <button type="submit" className="bg-[#0d3a54] text-white font-bold px-4 py-2 rounded-md hover:bg-[#093043]">
                        {isLoading ? "Iniciando..." : "Iniciar sesión"}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
