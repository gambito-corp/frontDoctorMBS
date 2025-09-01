// import { Input } from '@gambito-corp/mbs-library';
// import AuthLayout from '../../Layout/AuthLayout';
//
// export default function ResetPassword() {
//     return (
//         <AuthLayout>
//             <div className="max-w-md w-full p-8 bg-white rounded-md">
//                 <img src="https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/mbs-logo.svg" alt="Logo" className="h-10 mx-auto mb-6" />
//                 <form>
//                     <div className="mb-4">
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
//                         <Input type="password" name="password" id="password" required showPasswordToggle />
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
//                         <Input type="password" name="password_confirmation" id="password_confirmation" required showPasswordToggle />
//                     </div>
//
//                     <button type="submit" className="w-full bg-[#0d3a54] text-white font-bold px-4 py-2 rounded-md hover:bg-[#093043]">
//                         Restablecer contraseña
//                     </button>
//                 </form>
//             </div>
//         </AuthLayout>
//     );
// }
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input } from '@gambito-corp/mbs-library';
import AuthLayout from '../../Layout/AuthLayout';
import axios from 'axios';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState(null);

    // Obtén el token y email desde la URL
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatus(null);
        setLoading(true);

        // Validación básica en cliente
        if (!password || !passwordConfirmation) {
            setError('Por favor, completa ambos campos.');
            setLoading(false);
            return;
        }
        if (password !== passwordConfirmation) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}auth/reset-password`,
                {
                    email,
                    token,
                    password,
                    password_confirmation: passwordConfirmation,
                },
                { headers: { "Accept": "application/json" } }
            );
            setStatus('success');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Hubo un error al restablecer la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="max-w-md w-full p-8 bg-white rounded-md text-center">
                <img src="https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/mbs-logo.svg" alt="Logo" className="h-10 mx-auto mb-6" />
                <p className="text-gray-600 mb-6 text-sm">
                    Introduce tu nueva contraseña.
                </p>

                {status === 'success' && (
                    <p className="mb-4 text-sm text-green-600 bg-green-100 p-2 rounded">
                        ¡Contraseña restablecida correctamente! Redirigiendo al inicio de sesión...
                    </p>
                )}

                {error && (
                    <p className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Nueva contraseña"
                        className="mb-4"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        name="password_confirmation"
                        id="password_confirmation"
                        placeholder="Confirmar nueva contraseña"
                        className="mb-4"
                        value={passwordConfirmation}
                        onChange={e => setPasswordConfirmation(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#0d3a54] text-white font-bold px-4 py-2 rounded-md hover:bg-[#093043]"
                        disabled={loading}
                    >
                        {loading ? "Restableciendo..." : "Restablecer contraseña"}
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}
