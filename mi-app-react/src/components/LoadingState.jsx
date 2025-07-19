import React from 'react';


const LoadingState = ({ loading, isEmpty }) => {
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }
  
  if (isEmpty) {
    return <div className="message">No hay ciudades registradas</div>;
  }
  
  return null;
};

export default LoadingState;