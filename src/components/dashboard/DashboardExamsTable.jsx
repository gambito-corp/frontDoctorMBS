// src/components/dashboard/DashboardExamsTable.jsx
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

export default function DashboardExamsTable({ exams }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md mb-6 p-6">
            <h2 className="text-2xl font-bold text-[#0d3a54] mb-4">Últimos Exámenes Realizados</h2>
            <hr className="mb-4" />
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Examen</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calificación</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {exams && exams.length > 0 ? (
                        exams.map((exam, idx) => {
                            const fecha = dayjs(exam.created_at);
                            return (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap">{exam.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {fecha.format('DD/MM/YYYY')} ({fecha.fromNow()})
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {exam.exam_results?.[0]?.total_score ?? '—'}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No hay resultados.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
