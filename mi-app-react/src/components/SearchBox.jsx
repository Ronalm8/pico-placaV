import React from 'react';

const SearchBox = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="search-box">
            <input
                type="text"
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Buscar ciudad..."
                className="search-input"
            />
        </div>
    );
};

export default SearchBox;