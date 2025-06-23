// src/components/header/Header.jsx
import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useApi } from '../../hooks/useApi';

export default function Header({ onToggleSidebar }) {
    const location = useLocation();
    const navigate = useNavigate();
    const api = useApi(); // ← USAR useApi

    // Estados para menú y teams
    const [menu, setMenu] = useState([]);
    const [menuLoading, setMenuLoading] = useState(true);
    const [teams, setTeams] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(null); // ← NUEVO: Team actual
    const [teamsLoading, setTeamsLoading] = useState(false); // ← NUEVO: Loading teams

    // Obtener usuario de localStorage
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userName = user?.name || "Usuario";
    const userImage = user?.image || "https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/user-no-foto.png";

    // ✅ NUEVA FUNCIÓN PARA CAMBIAR TEAM
    const handleTeamSwitch = async (teamId) => {
        if (!teamId || teamsLoading) return;

        setTeamsLoading(true);

        try {
            console.log('🔄 Cambiando a team:', teamId);

            const result = await api.post('teams/switch', {
                team_id: teamId
            });

            if (result.success && result.data) {
                const newCurrentTeam = result.data.current_team;

                console.log('✅ Team cambiado exitosamente:', newCurrentTeam);

                setCurrentTeam(newCurrentTeam);
                localStorage.setItem('current_team', JSON.stringify(newCurrentTeam));

                // Opcional: Recargar menú si depende del team

            } else {
                console.error('❌ Error al cambiar team:', result.error);
            }

        } catch (error) {
            console.error('❌ Error en switch team:', error);
        } finally {
            setTeamsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            HOLAMUNDOOOOOOOOOOOOOOO
            <div className="flex items-center justify-between px-4 py-3">
                {/* IZQUIERDA */}
                {onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                )}

                {/* CENTRO - Menú */}
                <nav className="hidden md:flex space-x-8">
                    {menuLoading ? (
                        <div className="text-sm text-gray-500">Cargando menú...</div>
                    ) : (
                        menu.map((item) => (
                            <Link
                                key={item.route}
                                to={item.route}
                                className={`text-sm font-medium transition-colors ${
                                    location.pathname === item.route
                                        ? 'text-[#0d3a54] border-b-2 border-[#0d3a54]'
                                        : 'text-gray-600 hover:text-[#0d3a54]'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))
                    )}
                </nav>

                {/* DERECHA */}
                <div className="flex items-center space-x-4">

                    {/* ✅ NUEVO: SELECTOR DE TEAMS/MATERIAS */}
                    {user && teams.length > 0 && (
                        <div className="relative">
                            <select
                                value={currentTeam?.id || ''}
                                onChange={(e) => handleTeamSwitch(parseInt(e.target.value))}
                                disabled={teamsLoading}
                                className={`border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#0d3a54] focus:border-[#0d3a54] ${
                                    teamsLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <option value="">
                                    {teamsLoading ? 'Cambiando...' : 'Selecciona materia'}
                                </option>
                                {teams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>

                            {/* Indicador de carga */}
                            {teamsLoading && (
                                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0d3a54]"></div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PERFIL DE USUARIO */}
                    {user ? (
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                                <div className="text-right hidden sm:block">
                                    <span className="block">{userName.split(' ')[0]}</span>
                                    {/* Mostrar team actual */}
                                    {currentTeam && (
                                        <span className="block text-xs text-gray-500">
                                            {currentTeam.name}
                                        </span>
                                    )}
                                </div>
                                <img
                                    src={userImage}
                                    alt="Usuario"
                                    className="w-8 h-8 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/user-no-foto.png";
                                    }}
                                />
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {/* Información del usuario */}
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <p className="text-sm font-medium text-gray-900">{userName}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                            {currentTeam && (
                                                <p className="text-xs text-blue-600 mt-1">
                                                    📚 {currentTeam.name}
                                                </p>
                                            )}
                                        </div>

                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    to="/profile"
                                                    className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                                                >
                                                    👤 Perfil
                                                </Link>
                                            )}
                                        </Menu.Item>

                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                                                >
                                                    🚪 Finalizar sesión
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    ) : (
                        <Link
                            to="/login"
                            className="text-sm font-medium text-[#0d3a54] hover:text-[#093043]"
                        >
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
