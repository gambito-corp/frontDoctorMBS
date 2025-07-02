// src/components/Layout/MainLayout.jsx
import { useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import NavBar from "../organisms/NavBar";

export default function MainLayout({ children, showSidebar = false }) {
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar toggleSidebar={toggleSidebar} />

            <div className="flex">
                {showSidebar && (
                    <div className={`${sidebarVisible ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden`}>
                        <Sidebar onCloseMobile={() => setSidebarVisible(false)} />
                    </div>
                )}

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
