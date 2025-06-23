import React from 'react';
import SearchInput from '../atoms/SearchInput';
import Badge from '../atoms/Badge';

const SearchBar = ({
                       searchValue,
                       onSearchChange,
                       onClearSearch,
                       selectedCount = 0,
                       totalCount = 0,
                       placeholder = 'Buscar flashcards...',
                       className = '',
                       ...props
                   }) => {
    return (
        <div className={`flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg ${className}`} {...props}>
            {/* Buscador */}
            <div className="flex-1 max-w-md">
                <SearchInput
                    value={searchValue}
                    onChange={onSearchChange}
                    onClear={onClearSearch}
                    placeholder={placeholder}
                />
            </div>

            {/* Contadores */}
            <div className="flex items-center gap-3">
                {selectedCount > 0 && (
                    <Badge variant="primary" size="medium">
                        {selectedCount} seleccionada{selectedCount !== 1 ? 's' : ''}
                    </Badge>
                )}

                <Badge variant="default" size="medium">
                    {totalCount} total{totalCount !== 1 ? 'es' : ''}
                </Badge>
            </div>
        </div>
    );
};

export default SearchBar;
