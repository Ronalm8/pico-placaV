import React, { useEffect, useState } from 'react';
import { getRestrictions } from '../services/api';

function RestrictionsTable() {
  const [restrictions, setRestrictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestrictions = async () => {
      try {
        console.log('Obteniendo restricciones...');
        const data = await getRestrictions();
        console.log('Datos recibidos:', data);
        setRestrictions(data);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar las restricciones');
      } finally {
        setLoading(false);
      }
    };

    fetchRestrictions();
  }, []);

  if (loading) return <p>Cargando restricciones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Restricciones</h2>
      {Object.keys(restrictions).map((city) => (
        <div key={city}>
          <h3>{city.toUpperCase()}</h3>
          <ul>
            {restrictions[city].map((restriction, index) => (
              <li key={index}>
                Día {restriction.day}: {restriction.plates}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default RestrictionsTable;