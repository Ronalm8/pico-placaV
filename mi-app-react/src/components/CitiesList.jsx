import React from 'react';
import CitySection from './CitySection';

const CitiesList = ({ cities, onDelete, onUpdateRestriction, loading }) => {
  return (
    <div className="cities-grid">
      {cities.map(([city, cityRestrictions]) => (
        <CitySection
          key={city}
          city={city}
          restrictions={cityRestrictions}
          onDelete={onDelete}
          onUpdateRestriction={onUpdateRestriction}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default CitiesList;