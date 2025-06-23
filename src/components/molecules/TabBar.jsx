import React, { useRef } from 'react';
import Tab from '../atoms/Tab';
import Badge from '../atoms/Badge';
import IconButton from '../atoms/IconButton';

const TabBar = ({
                    tabs = [],
                    activeTab,
                    onTabChange,
                    showCounts = false,
                    className = '',
                    ...props
                }) => {
    const tabSliderRef = useRef(null);

    const scrollTabs = (direction) => {
        if (tabSliderRef.current) {
            const scrollAmount = 200;
            const newScrollLeft = direction === 'left'
                ? tabSliderRef.current.scrollLeft - scrollAmount
                : tabSliderRef.current.scrollLeft + scrollAmount;

            tabSliderRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={`border-b border-gray-200 relative ${className}`} {...props}>
            {/* Botón izquierdo para tabs */}
            <IconButton
                icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                }
                onClick={() => scrollTabs('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md hover:bg-gray-50"
                size="medium"
            />

            {/* Contenedor deslizable de tabs */}
            <div
                ref={tabSliderRef}
                className="flex overflow-x-auto scrollbar-hide px-10"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <nav className="-mb-px flex space-x-2 min-w-max">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id} // ← AGREGAR KEY
                            className="flex items-center flex-shrink-0"
                        >
                            <Tab
                                active={activeTab === tab.id}
                                onClick={() => onTabChange(tab.id)}
                                disabled={tab.disabled}
                                className="flex items-center gap-2"
                            >
                                {showCounts && tab.count !== undefined && (
                                    <Badge
                                        variant={activeTab === tab.id ? 'primary' : 'default'}
                                        size="small"
                                    >
                                        {tab.count}
                                    </Badge>
                                )}
                                {tab.name}
                            </Tab>
                        </div>
                    ))}
                </nav>

            </div>

            {/* Botón derecho para tabs */}
            <IconButton
                icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                }
                onClick={() => scrollTabs('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md hover:bg-gray-50"
                size="medium"
            />

            <style jsx={"true"}>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default TabBar;
