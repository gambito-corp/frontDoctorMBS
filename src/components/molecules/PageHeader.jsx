import React from 'react';
import Title from '../atoms/Title';
import Icon from '../atoms/Icon';

const PageHeader = ({ title, icon }) => {
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    {icon && <Icon name={icon} className="mr-2" />}
                    <Title>{title}</Title>
                </div>
            </div>
        </header>
    );
};

export default PageHeader;
