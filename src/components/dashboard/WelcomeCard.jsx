// src/components/dashboard/WelcomeCard.jsx
import { useNavigate } from 'react-router-dom';
import { getUserType } from '../../utils/getUserType';

export default function WelcomeCard({ user }) {
    const navigate = useNavigate();
    const userType = getUserType(user);

    // Root, Rector y Pro: acceso completo
    const isFullAccess = ['root', 'rector', 'pro'].includes(userType);

    // Estudiante y Freemium: acceso limitado
    const isLimited = ['estudiante', 'freemium'].includes(userType);

    return (
        <div className={`border rounded-lg shadow-md p-6 mb-6 ${
            isFullAccess
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
        }`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className={`text-xl font-bold ${
                        isFullAccess ? 'text-blue-800' : 'text-yellow-800'
                    }`}>
                        {isFullAccess
                            ? '🚀 Usuario Premium'
                            : '🔓 Acceso Limitado'
                        }
                    </h3>
                    <p className={`text-sm ${
                        isFullAccess ? 'text-blue-600' : 'text-yellow-700'
                    }`}>
                        {isFullAccess
                            ? 'Acceso completo a todas las funcionalidades premium.'
                            : 'Explora DoctorMBS, pero algunas funcionalidades están limitadas. ¡Mejora tu experiencia!'
                        }
                    </p>
                    {isLimited && (
                        <button
                            onClick={() => navigate('/planes')}
                            className="mt-3 px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded hover:bg-yellow-500 transition"
                        >
                            ¡Hazte Pro y desbloquea todo!
                        </button>
                    )}
                </div>
                <div className={`text-4xl ${
                    isFullAccess ? 'text-blue-500' : 'text-yellow-500'
                }`}>
                    {isFullAccess ? '⭐' : '🛡️'}
                </div>
            </div>
        </div>
    );
}
