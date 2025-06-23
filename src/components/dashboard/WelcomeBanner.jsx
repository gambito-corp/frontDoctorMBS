// src/components/dashboard/WelcomeBanner.jsx
export default function WelcomeBanner({ userName }) {
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Buenos días' : currentHour < 18 ? 'Buenas tardes' : 'Buenas noches';

    return (
        <div className="bg-gradient-to-r from-[#0d3a54] to-[#1e5f7a] text-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {greeting}, {userName}! 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Bienvenido a tu panel de control de MedFlashcards
                    </p>
                </div>
                <div className="hidden md:block text-6xl opacity-20">
                    📚
                </div>
            </div>
        </div>
    );
}
