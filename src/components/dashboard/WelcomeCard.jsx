// src/components/dashboard/WelcomeCard.jsx
export default function WelcomeCard({ status }) {
    const isPro = status === 1;

    return (
        <div className={`border rounded-lg shadow-md p-6 mb-6 ${isPro ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className={`text-xl font-bold ${isPro ? 'text-blue-800' : 'text-green-800'}`}>
                        {isPro ? '🚀 Usuario Pro' : '👨‍⚕️ DoctorMBS'}
                    </h3>
                    <p className={`text-sm ${isPro ? 'text-blue-600' : 'text-green-600'}`}>
                        {isPro
                            ? 'Acceso completo a todas las funcionalidades premium'
                            : 'Acceso profesional para médicos certificados'
                        }
                    </p>
                </div>
                <div className={`text-4xl ${isPro ? 'text-blue-500' : 'text-green-500'}`}>
                    {isPro ? '⭐' : '🩺'}
                </div>
            </div>
        </div>
    );
}
