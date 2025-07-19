import React from 'react';
import { normalize } from '../utils/normalize';

function CitySelector({ cities = [], selectedCity, onChangeCity, loading }) {
  if (loading || !cities.length) return null;

  const sortedCities = [...cities].sort((a, b) =>
    a.localeCompare(b, 'es', { sensitivity: 'base' })
  );

  return (
    <div className="city-selector">
      <select
        value={selectedCity || ''}
        onChange={(e) => onChangeCity(e.target.value)}
        className="city-select"
      >
        <option value="" disabled>
          Seleccione una Ciudad
        </option>
        {sortedCities.map((city) => (
          <option key={city} value={city}>
            {normalize(city)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.memo(CitySelector);
