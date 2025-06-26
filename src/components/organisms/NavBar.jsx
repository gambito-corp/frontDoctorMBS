// src/components/NavBar.jsx
import { useState, useEffect, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import {useApi} from '../../hooks/useApi';
import RoleSelector from '../RoleSelector';
export default function NavBar() {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [currentSubject, setCurrentSubject] = useState('');
    const [navigationItems, setNavigationItems] = useState([]);
    const [currentTeam, setCurrentTeam] = useState(null);

    const api = useApi();


    useEffect(() => {
        // Cuando subjects se carga, establece el valor inicial de currentSubject
        if (subjects.length > 0) {
            const currentTeam = subjects.find(subject => subject.is_current === true);
            if (currentTeam && !currentSubject) {
                setCurrentSubject(currentTeam.id.toString()); // Asegúrate de que sea string
            }
        }
    }, [subjects]); // Se ejecuta cuando subjects cambia
    useEffect(() => {
        // Obtener usuario del localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                // Configurar menú según el rol
                const menuItems = getNavigationItemsByRole(parsedUser);
                getTeamsbyUser(parsedUser);
                setNavigationItems(menuItems);
            } catch (error) {
                console.error('❌ Error al parsear usuario:', error);
                setUser(null);
                setNavigationItems(getNavigationItemsByRole(null));
            }
        } else {
            console.log('❌ No hay usuario en localStorage');
            setNavigationItems(getNavigationItemsByRole(null));
        }
    }, []);

    // FUNCIÓN PARA OBTENER MENÚ SEGÚN ROL - Versión mejorada
    const getNavigationItemsByRole = (user) => {
        // Menú por defecto si no hay usuario o roles
        const defaultMenu = [
            { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
        ];

        if (!user) {
            console.log('❌ Usuario no autenticado, usando menú por defecto');
            window.location.href = '/login';
            return [];
        }

        if (!user.roles || !Array.isArray(user.roles)) {
            console.log('❌ Usuario sin roles válidos, usando menú por defecto');
            window.location.href = '/login';
            return [];
        }

        // Verificar roles específicos
        const isRoot = user.roles.includes('root');
        const isAdmin = user.roles.includes('admin');
        const isPro = user.is_pro === 1 || user.roles.includes('pro');

        // Menú base para todos los usuarios autenticados
        let menuItems = [
            { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
            { name: 'MedFlash', path: '/medflash', icon: '🧠' },
        ];

        // Agregar items según roles
        if (isPro || isAdmin || isRoot) {
            menuItems.push({ name: 'MedBank', path: '/medbanks', icon: '📚' });
            menuItems.push({ name: 'MedChat', path: '/medchat', icon: '💬' });
        }

        // TODO: ADMINISTRACION MENU
        // Items exclusivos para administradores y root
        // if (isAdmin || isRoot) {
        //     menuItems.push({ name: 'Reportes', path: '/reports', icon: '📊' });
        // }
        //
        // // Items exclusivos para root
        // if (isRoot) {
        //     menuItems.push({ name: 'Admin', path: '/admin', icon: '⚙️' });
        //     menuItems.push({ name: 'Usuarios', path: '/admin/users', icon: '👥' });
        // }
        //
        // console.log('📋 Menú generado:', menuItems);
        return menuItems;
    };
    const getTeamsbyUser = async (user) => {
        if (!user) return []; // Return an empty array if there's no user

        try {
            const response = await api.get('teams'); // Await the API response
            if (response.success && response.data.teams) {
                setCurrentTeam(response.data.current)
                setSubjects(response.data.teams);
                return [];
            }
            console.error('Unexpected API response:', response);
            return []; // Return an empty array in case of an unexpected structure
        } catch (error) {
            console.error('Error fetching teams:', error);
            return []; // Return an empty array in case of an error
        }
    };


    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">

                    {/* LOGO */}
                    <div className="flex-shrink-0">
                        <Link to="/dashboard" className="flex items-center">
                            <img
                                src="https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/mbs-logo.svg"
                                alt="MBS Logo"
                                className="h-8 w-auto"
                            />
                            <span className="ml-2 text-xl font-bold text-[#0d3a54] hidden sm:block">
                                MBS
                            </span>
                        </Link>
                    </div>

                    {/* LINKS CENTRO - DINÁMICOS SEGÚN ROL */}
                    <div className="hidden md:flex space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    location.pathname === item.path
                                        ? 'text-[#0d3a54] bg-blue-50'
                                        : 'text-gray-600 hover:text-[#0d3a54]'
                                }`}
                            >
                                {item.name}
                                {/* Indicador visual para usuarios root */}
                                {user?.roles?.includes('root') && item.name === 'Admin' && (
                                    <span className="ml-1 text-xs bg-red-500 text-white px-1 rounded">ROOT</span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* DERECHA - SELECTOR DE ROL + SELECTOR DE MATERIA + PERFIL */}
                    <div className="flex items-center space-x-4">

                        {/* ✅ SELECTOR DE ROL PARA ROOT */}
                        <RoleSelector />

                        {/* Selector de Materias */}
                        {subjects.length > 0 && (
                            <select
                                value={currentSubject}
                                onChange={(e) => setCurrentSubject(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-[#0d3a54] focus:border-[#0d3a54]"
                            >
                                <option value="">Selecciona materia</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Perfil de Usuario */}
                        {user ? (
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d3a54]">
                                        <span className="sr-only">Abrir menú de usuario</span>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-gray-700 font-medium">
                                                {user.name?.split(' ')[0]}
                                            </span>

                                            {/* Mostrar rol si es root */}
                                            {user.roles?.includes('root') && (
                                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full font-medium">
                                                    ROOT
                                                </span>
                                            )}

                                            <img
                                                className="h-8 w-8 rounded-full border-2 border-gray-300"
                                                src={user.profile_photo_url || "https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/user-no-foto.png"}
                                                alt={user.name}
                                                onError={(e) => {
                                                    e.target.src = "https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/user-no-foto.png";
                                                }}
                                            />
                                        </div>
                                    </Menu.Button>
                                </div>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>

                                            {/* Mostrar roles */}
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {user.roles?.map((role) => (
                                                    <span
                                                        key={role}
                                                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                                    >
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    to="/profile"
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } block px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    Mi Perfil
                                                </Link>
                                            )}
                                        </Menu.Item>

                                        {/* Opción adicional para usuarios root */}
                                        {user.roles?.includes('root') && (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/admin/config"
                                                        className={`${
                                                            active ? 'bg-gray-100' : ''
                                                        } block px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        🔧 Configuración Admin
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        )}

                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handleLogout}
                                                    className={`${
                                                        active ? 'bg-gray-100' : ''
                                                    } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                                >
                                                    Cerrar Sesión
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        ) : (
                            <Link
                                to="/login"
                                className="text-gray-500 hover:text-[#0d3a54] px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* MENÚ MÓVIL */}
            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                                location.pathname === item.path
                                    ? 'text-[#0d3a54] bg-gray-100'
                                    : 'text-gray-500 hover:text-[#0d3a54] hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-2">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}