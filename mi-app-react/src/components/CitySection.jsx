import React from 'react';
import RestrictionTable from './RestrictionTable';

const CitySection = ({ 
    city, 
    restrictions, 
    onDelete, 
    onUpdateRestriction, 
    loading 
}) => {
    return (
        <div className="city-section">
            <div className="city-header">
                <h2>{city.toUpperCase()}</h2>
                <button 
                    onClick={() => onDelete(city)}
                    className="delete-button"
                >
                    Eliminar Ciudad
                </button>
            </div>
            <RestrictionTable
                city={city}
                restrictions={restrictions}
                onUpdateRestriction={onUpdateRestriction}
                loading={loading}
            />
        </div>
    );
};

export default CitySection;