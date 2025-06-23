// src/components/dashboard/DashboardAccessCard.jsx
import { Link } from 'react-router-dom';

export default function DashboardAccessCard({ title, description, icon, route, color = "blue" }) {
    const colorClasses = {
        blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
        green: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
        purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
        orange: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100'
    };

    return (
        <Link to={route} className={`block border rounded-lg shadow-md p-6 transition-colors ${colorClasses[color]}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold mb-2">{title}</h3>
                    <p className="text-sm opacity-80">{description}</p>
                </div>
                <div className="text-4xl opacity-70">
                    {icon}
                </div>
            </div>
        </Link>
    );
}
