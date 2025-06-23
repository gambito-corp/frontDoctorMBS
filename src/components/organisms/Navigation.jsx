import React, { useState } from 'react';

const Navigation = ({ user, menuItems = [], teams = [], currentTeam, onLogout, onTeamSwitch }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-[99]">
            {/* Contenedor de ancho completo */}
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="shrink-0 flex items-center mr-24 pr-24">
                        <a href={process.env.REACT_APP_API_BASE_URL}>
                            <img
                                src="/logo.png"
                                alt="MBS - Med By Students"
                                className="block h-9"
                            />
                        </a>
                    </div>

                    {/* Navigation Links - Centrados */}
                    <div className="hidden space-x-8 sm:flex items-center flex-1 justify-center">
                        {menuItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.url}
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${
                                    item.active
                                        ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {item.name}
                                {item.need_premium && (
                                    <span className="ml-1 inline-block bg-yellow-400 text-xs text-white px-1 rounded">
                                        PRO
                                    </span>
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Right Side Menu */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-3">
                        {/* Team Dropdown - Siempre visible */}
                        <TeamDropdown
                            currentTeam={currentTeam}
                            teams={teams}
                            onTeamSwitch={onTeamSwitch}
                        />

                        {/* User Dropdown con avatar */}
                        <UserDropdown user={user} onLogout={onLogout} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Componentes de dropdown actualizados
const TeamDropdown = ({ currentTeam, teams = [], onTeamSwitch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const displayTeam = currentTeam?.name || 'Medicina';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:bg-gray-50 active:bg-gray-50 transition ease-in-out duration-150"
            >
                {displayTeam}
                <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                        <div className="block px-4 py-2 text-xs text-gray-400">
                            Selecciona Materia
                        </div>
                        {teams.length > 0 ? (
                            teams.map((team) => (
                                <button
                                    key={team.id}
                                    onClick={() => {
                                        onTeamSwitch(team.id);
                                        setIsOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {team.name}
                                </button>
                            ))
                        ) : (
                            <div className="block px-4 py-2 text-sm text-gray-700">
                                No hay materias
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const UserDropdown = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:bg-gray-50 active:bg-gray-50 transition ease-in-out duration-150"
            >
                {/* Avatar del usuario */}
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                    {user?.profile_photo_url ? (
                        <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={user.profile_photo_url}
                            alt={user.name}
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-700">
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </span>
                    )}
                </div>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="block px-4 py-2 text-xs text-gray-400">
                        administrar cuenta
                    </div>
                    <div className="py-1">
                        <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Perfil
                        </a>
                        <div className="border-t border-gray-200"></div>
                        <button
                            onClick={() => {
                                onLogout();
                                setIsOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navigation;
