import { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import NavBar from "../organisms/NavBar";
import { useAuth } from '../../hooks/useAuth';

export default function MainLayout({ children, showSidebar = false }) {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const { checkAuthAndRedirect } = useAuth();

    useEffect(() => {
        (async () => {
            await checkAuthAndRedirect();
            setLoading(false);
        })();
    }, [checkAuthAndRedirect]);


    const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

    if (loading) return null;

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
