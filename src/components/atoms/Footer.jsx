import React from 'react';

const Footer = ({ className = '' }) => {
    const currentYear = new Date().getFullYear();
    const appName = process.env.REACT_APP_NAME || 'MBS';

    return (
        <footer className={`bg-footer text-white z-10 footer-mbs flex flex-col md:flex-row justify-between px-[20px] md:px-[50px] py-[35px] ${className}`}>
            <div className="text-sm text-center mb-3 md:mb-0">
                © {currentYear} {appName}. Todos los derechos reservados.
            </div>
            <div className="text-sm flex flex-col md:flex-row gap-4 underline text-center">
                <a
                    href="https://medbystudents.com/libro-de-reclamaciones/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors"
                >
                    Libro de reclamaciones
                </a>
                <a
                    href="https://medbystudents.com/politicas-de-privacidad/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-300 transition-colors"
                >
                    Políticas de privacidad
                </a>
            </div>
        </footer>
    );
};

export default Footer;
