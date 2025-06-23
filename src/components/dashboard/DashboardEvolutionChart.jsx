// src/components/dashboard/DashboardEvolutionChart.jsx
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function DashboardEvolutionChart({ chartData }) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Evolución de Rendimiento',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };

    const data = {
        labels: chartData?.day?.labels || [],
        datasets: [
            {
                label: 'Puntuación',
                data: chartData?.day?.data || [],
                borderColor: '#0d3a54',
                backgroundColor: 'rgba(13, 58, 84, 0.2)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#0d3a54] mb-4">Evolución de Rendimiento</h2>
            <hr className="mb-4" />
            <div className="h-64">
                <Line options={options} data={data} />
            </div>
        </div>
    );
}
