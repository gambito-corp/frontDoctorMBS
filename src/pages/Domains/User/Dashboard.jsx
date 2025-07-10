// src/pages/Domains/User/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardEvolutionChart from '../../../components/dashboard/DashboardEvolutionChart';
import DashboardExamsTable from '../../../components/dashboard/DashboardExamsTable';
import WelcomeCard from '../../../components/dashboard/WelcomeCard';
import WelcomeBanner from '../../../components/dashboard/WelcomeBanner';
import DashboardAccessCard from '../../../components/dashboard/DashboardAccessCard';
import { useApi } from '../../../hooks/useApi';
import { getAccessToken, getRefreshToken } from "../../../utils/tokens";
import { getUserType } from "../../../utils/getUserType";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [exams, setExams] = useState([]);
    const [chartData, setChartData] = useState({
        day: { labels: [], data: [] },
        week: { labels: [], data: [] },
        month: { labels: [], data: [] },
    });
    const navigate = useNavigate();
    const api = useApi();
    const isAuthenticated = () => {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        return (
            accessToken && accessToken.trim() !== '' &&
            refreshToken && refreshToken.trim() !== ''
        );
    };

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
            return;
        }

        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // CARGAR DATOS DEL DASHBOARD usando useApi
            fetchDashboardData();
        } catch (error) {
            console.error("Error parsing user:", error);
            navigate("/login");
        }
    }, [navigate]);

    // FUNCIÓN PARA CARGAR DATOS usando useApi
    const fetchDashboardData = async () => {
        try {
            console.log('📊 Cargando datos del dashboard...');

            // Peticiones paralelas usando tu useApi
            const [graphResult, examsResult] = await Promise.all([
                api.get('questions/get-graph-exams-data'),
                api.get('questions/get-last-exams-results')
            ]);

            // Procesar datos de gráficos
            if (graphResult.success && graphResult.data.grahs) {
                const grahs = graphResult.data.grahs;
                setChartData({
                    day: { labels: grahs.daily.labels, data: grahs.daily.data },
                    week: { labels: grahs.weekly.labels, data: grahs.weekly.data },
                    month: { labels: grahs.monthly.labels, data: grahs.monthly.data },
                });
                console.log('📈 Datos de gráficos cargados');
            }

            // Procesar datos de exámenes
            if (examsResult.success && examsResult.data.results) {
                setExams(examsResult.data.results);
                console.log('📝 Datos de exámenes cargados:', examsResult.data.results.length);
            }

        } catch (error) {
            console.error("❌ Error al cargar datos del dashboard:", error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0d3a54] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <WelcomeBanner userName={user.name} />
            <WelcomeCard user={user} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <DashboardAccessCard
                    title="MedFlash"
                    description="Practica con flashcards interactivas"
                    icon="🧠"
                    route="/medflash"
                    color="blue"
                />
                <DashboardAccessCard
                    title="MedBank"
                    description="Banco de preguntas médicas"
                    icon="📚"
                    route="/medbank"
                    color="green"
                />
                <DashboardAccessCard
                    title="DoctorMBS"
                    description="Chat inteligente médico"
                    icon="💬"
                    route="/doctor-mbs"
                    color="purple"
                />
            </div>

            <DashboardExamsTable exams={exams} />
            <DashboardEvolutionChart chartData={chartData} />
        </div>
    );
}
