import React from 'react';

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex overflow-hidden">
            {/* Columna izquierda */}
            <div className="w-1/2 flex items-center justify-center bg-white">
                <div className="max-w-md w-full p-8 bg-white rounded-md">{children}</div>
            </div>

            {/* Columna derecha: Imagen + overlay */}
            <div className="w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-l from-[#0d3a54cc] to-[#0d3a54cc] z-10"></div>
                <img
                    src="https://med-by-students.s3.sa-east-1.amazonaws.com/StaticFiles/login-bg.webp"
                    alt="Background"
                    className="h-full w-full object-cover object-center"
                />
            </div>
        </div>
    );
}
