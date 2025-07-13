import { Input } from '@gambito-corp/mbs-library';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../Layout/AuthLayout';
import { useState } from 'react';
import axios from 'axios';

export default function Register() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const name = formData.get("name");
        const email = formData.get("email");
        const telefono = formData.get("telefono");
        const pais = formData.get("pais");
        const password = formData.get("password");
        const password_confirmation = formData.get("password_confirmation");
        // Comprobaciones simples por si quieres validar más allá del "required" nativo
        if (!name || !email || !password || !password_confirmation || !pais) {
            setError("Por favor, completa todos los campos obligatorios.");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("name", name);
        formDataToSend.append("email", email);
        formDataToSend.append("telefono", telefono || '');
        formDataToSend.append("pais", pais);
        formDataToSend.append("password", password);
        formDataToSend.append("password_confirmation", password_confirmation);

        try {
            const response = await axios.post(`${API_URL}auth/register`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            const result = response.data;
            if ((result.status === 200 || result.status === 201) && result.success) {
                navigate("/login");
            }
        } catch (err) {
            if (err.response?.status === 422) {
                setError("El correo ya está registrado. ¿Quieres iniciar sesión?");
            } else {
                setError("Error al registrar usuario.");
            }
        }

    };

    return (
        <AuthLayout>
            <div className="max-w-md w-full p-8 bg-white rounded-md">
                <div className="flex justify-center mb-6">
                    <img src="https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/mbs-logo.svg" alt="Logo" className="h-10" />
                </div>

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <Input type="text" name="name" id="name" required />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <Input type="email" name="email" id="email" required />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <Input type="text" name="telefono" id="telefono" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="pais" className="block text-sm font-medium text-gray-700">País</label>
                        <select
                            name="pais"
                            id="pais"
                            required
                            className="block w-full px-3 py-[10px] border border-gray-300 rounded-md shadow-sm text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-[#0d3a54] focus:border-[#0d3a54] bg-white text-gray-900"
                        >
                            <option value="">Selecciona tu país</option>
                            <option value="España">España</option>
                            <option value="Peru">Perú</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <Input type="password" name="password" id="password" required showPasswordToggle />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                        <Input type="password" name="password_confirmation" id="password_confirmation" required showPasswordToggle />
                    </div>

                    <div className="flex justify-between items-center">
                        <Link
                            to="/login"
                            className="text-sm font-bold text-[#0d3a54] border border-[#0d3a54] px-4 py-2 rounded-md hover:bg-[#0d3a54] hover:text-white"
                        >
                            Inicia sesión
                        </Link>

                        <button type="submit" className="bg-[#0d3a54] text-white font-bold px-4 py-2 rounded-md hover:bg-[#093043]">
                            REGISTRARSE
                        </button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}
