import React from 'react';
import { deleteCity } from '../services/api';

function DeleteCityButton({ city, onCityDeleted }) {
  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar la ciudad ${city}?`)) {
      try {
        await deleteCity(city);
        onCityDeleted();
      } catch (err) {
        alert('Error al eliminar la ciudad: ' + err.message);
      }
    }
  };

  return <button onClick={handleDelete}>Eliminar {city}</button>;
}

export default DeleteCityButton;