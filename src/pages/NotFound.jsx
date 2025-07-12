// src/pages/Errors/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="text-[120px] leading-none font-bold text-indigo-500 drop-shadow-lg">
                404
            </div>

            <i className="fa-solid fa-ghost text-[64px] text-indigo-300 mt-2 mb-4 animate-bounce" />

            <h2 className="text-2xl mt-2 font-semibold text-gray-700">
                ¡Ups! No encontramos esa página
            </h2>

            <p className="text-gray-500 mt-2 mb-6 text-lg">
                Puede que hayas escrito mal la dirección o la página fue movida/eliminada.
            </p>

            <Link
                to="/"
                className="px-6 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700 transition"
            >
                <i className="fa-solid fa-house mr-2" />
                Volver al inicio
            </Link>
        </div>
    );
}
