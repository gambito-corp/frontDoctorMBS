import React from 'react';
import Dropdown from '../atoms/Dropdown';

const TeamDropdown = ({ currentTeam, teams = [], onTeamSwitch }) => {
    // Siempre mostrar el dropdown, incluso si no hay teams
    const displayTeam = currentTeam?.name || 'Medicina';

    const trigger = (
        <span className="inline-flex rounded-md">
            <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:bg-gray-50 active:bg-gray-50 transition ease-in-out duration-150"
            >
                {displayTeam}
                <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                </svg>
            </button>
        </span>
    );

    return (
        <Dropdown trigger={trigger} align="right" width="48">
            <div className="block px-4 py-2 text-xs text-gray-400">
                Selecciona Materia
            </div>
            {teams.length > 0 ? (
                teams.map((team) => (
                    <button
                        key={team.id}
                        onClick={() => onTeamSwitch(team.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        {team.name}
                    </button>
                ))
            ) : (
                <div className="block px-4 py-2 text-sm text-gray-700">
                    No hay materias disponibles
                </div>
            )}
        </Dropdown>
    );
};


export default TeamDropdown;
