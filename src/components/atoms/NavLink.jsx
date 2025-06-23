import React from 'react';
import { useLocation } from 'react-router-dom';

const NavLink = ({ href, children, active = false, className = '' }) => {
    const location = useLocation();
    const isActive = active || location.pathname === href;

    const baseClasses = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none";
    const activeClasses = "border-indigo-400 text-gray-900 focus:border-indigo-700";
    const inactiveClasses = "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300";

    return (
        <a
            href={href}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${className}`}
        >
            {children}
        </a>
    );
};

export default NavLink;
