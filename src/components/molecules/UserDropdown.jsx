import React from 'react';
import Dropdown from '../atoms/Dropdown';

const UserDropdown = ({ user, onLogout }) => {
    const trigger = (
        <span className="inline-flex rounded-md">
            <button
                type="button"
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
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    )}
                </div>
                {user?.name || 'Usuario'}
                <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                </svg>
            </button>
        </span>
    );

    return (
        <Dropdown trigger={trigger} align="right" width="48">
            {/* Header del dropdown con info del usuario */}
            <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                        {user?.profile_photo_url ? (
                            <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.profile_photo_url}
                                alt={user.name}
                            />
                        ) : (
                            <span className="text-lg font-medium text-gray-700">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                </div>
            </div>

            <div className="py-1">
                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Perfil
                </a>
                <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    Cerrar Sesión
                </button>
            </div>
        </Dropdown>
    );
};


export default UserDropdown;
