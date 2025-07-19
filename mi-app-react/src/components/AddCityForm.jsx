import React from 'react';

const AddCityForm = ({ newCityName, onNewCityChange, onAddCity, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCity(); 
  };

  return (
    <form className="add-city-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          value={newCityName}
          onChange={onNewCityChange}
          placeholder="Nombre de la nueva ciudad"
          pattern="[A-Za-záéíóúñ.\s]*"
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading || !newCityName.trim()}
        >
          Agregar Ciudad
        </button>
      </div>
    </form>
  );
};

export default AddCityForm;
