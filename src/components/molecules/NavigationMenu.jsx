import React from 'react';
import NavLink from '../atoms/NavLink';

const NavigationMenu = ({ menuItems = [] }) => {
    return (
        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
            {menuItems.map((item, index) => (
                <NavLink
                    key={index}
                    href={item.route}
                    active={item.active}
                >
                    {item.name}
                    {item.need_premium && (
                        <span className="ml-1 inline-block bg-yellow-400 text-xs text-white px-1 rounded">
                            PRO
                        </span>
                    )}
                </NavLink>
            ))}
        </div>
    );
};

export default NavigationMenu;
