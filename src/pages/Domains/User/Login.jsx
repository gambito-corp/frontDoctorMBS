// src/pages/Domains/User/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from '@gambito-corp/mbs-library';
import AuthLayout from '../../Layout/AuthLayout';

export default function Login() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const redirectIfAuthenticated = () => {
        const tokenKey = process.env.REACT_APP_TOKEN_STORAGE_KEY || "sanctum_token";
        const token = localStorage.getItem(tokenKey);
        if (token && token.trim() !== '' && token !== 'null' && token !== 'undefined') {
            // Si hay un token válido, redirigir al dashboard
            navigate("/dashboard", { replace: true });
        }
    }

    useEffect(() => {
        redirectIfAuthenticated();
    }, [navigate]); // Dependencia en navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("email", email);
            formDataToSend.append("password", password);

            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}auth/login`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            );

            const result = response.data;

            // SIMPLE: Solo guardar en localStorage y navegar
            const tokenKey = process.env.REACT_APP_TOKEN_STORAGE_KEY || "sanctum_token";
            localStorage.setItem(tokenKey, result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            // Navegación directa sin validaciones
            navigate("/dashboard", { replace: true });

        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || "Error al conectar con el servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center">
                <div className="flex justify-center mb-6">
                    <img src="https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/mbs-logo.svg" alt="Logo" className="h-10" />
                </div>

                <p className="text-sm mb-6 text-gray-600">
                    Ingresa con tu cuenta personal para guardar tu progreso individual.
                </p>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-left">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Correo electrónico
                        </label>
                        <Input
                            type="email"
                            name="email"
                            icon="envelope"
                            placeholder="tu@email.com"
                            id="email"
                            required
                        />
                    </div>

                    <div className="mb-4 text-left">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            id="password"
                            name="password"
                            required
                            showPasswordToggle={true}
                        />
                    </div>

                    <div className="flex items-center mb-4 text-left">
                        <input type="checkbox" id="remember" name="remember" className="mr-2" />
                        <label htmlFor="remember" className="text-sm text-gray-600">
                            Mantener sesión activa
                        </label>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <Link
                            to="/register"
                            className="text-sm font-bold text-[#0d3a54] border border-[#0d3a54] px-4 py-2 rounded-md hover:bg-[#0d3a54] hover:text-white"
                        >
                            Regístrate ahora
                        </Link>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="ml-4 bg-[#0d3a54] text-white font-bold px-4 py-2 rounded-md hover:bg-[#093043] disabled:opacity-50"
                        >
                            {isLoading ? "Iniciando..." : "Iniciar sesión"}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-900 underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
