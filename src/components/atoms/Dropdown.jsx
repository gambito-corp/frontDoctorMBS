import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, children, align = 'right', width = '48' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const alignmentClasses = {
        left: 'origin-top-left left-0',
        right: 'origin-top-right right-0'
    };

    const widthClasses = {
        '48': 'w-48'
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            {isOpen && (
                <div className={`absolute z-50 mt-2 ${widthClasses[width]} rounded-md shadow-lg ${alignmentClasses[align]}`}>
                    <div className="rounded-md ring-1 ring-black ring-opacity-5 py-1 bg-white">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
