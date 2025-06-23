import React from 'react';
import MainContent from '../organisms/MainContent';
import Footer from '../atoms/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavBar from '../organisms/NavBar';

const AppLayout = ({
                       title = 'Dashboard',
                       icon,
                       children,
                   }) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <NavBar />

            {title && (
                <header className="bg-white ml-48 mt-4 shadow w-fit">
                    <div className="p-4 sm:px-6 lg:px-8 inline-flex items-center">
                        <FontAwesomeIcon
                            icon={icon ? ['fas', icon] : ['far', 'circle-question']}
                            className="mr-2"
                        />
                        <span className="inline-block">
                            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                {title}
                            </h2>
                        </span>
                    </div>
                </header>
            )}

            <div className="flex-1">
                <MainContent>
                    {children}
                </MainContent>
            </div>

            <Footer />
        </div>
    );
};

export default AppLayout;
