import React from 'react';
import {
  useGetRestrictions,
  useUpdateRestriction
} from '../hooks/restrictionsQueries';
import { useStatusMessage } from '../hooks/useStatusMessage';
import AdminHeader from './AdminHeader';
import SearchBox from './SearchBox';
import AddCityForm from './AddCityForm';
import StatusMessages from './StatusMessages';
import LoadingState from './LoadingState';
import CitiesList from './CitiesList';
import { useCitiesAdmin } from '../hooks/useCitiesAdmin';

function AdminPanel() {
  const { data: restrictions, isLoading: loading, error: apiError } = useGetRestrictions();
  const updateRestrictionMutation = useUpdateRestriction();
  const { message: statusMessage, type, isVisible, showMessage } = useStatusMessage();
  
  const {
    newCityName,
    searchTerm,
    inputError,
    handleNewCityChange,
    handleSearchChange,
    handleAddCity,
    handleDeleteCity,
    filteredCities,
  } = useCitiesAdmin(restrictions, showMessage);

  const handleUpdateRestriction = (city, day, plates, schedules) => {
    updateRestrictionMutation.mutate(
      { city, day, plates, schedules },
      {
        onSuccess: () => showMessage(`Restricción actualizada para ${city} - ${day}`),
        onError: (error) => showMessage(`Error: ${error.message}`, true)
      }
    );
  };

  return (
    <div className="container">
      <AdminHeader />

      <div className="forms-container">
        <SearchBox
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
        <AddCityForm
          newCityName={newCityName}
          onNewCityChange={handleNewCityChange}
          onAddCity={handleAddCity}
          loading={loading}
        />
      </div>

      {inputError && (
        <div className="input-error-message">
          {inputError}
        </div>
      )}

      <StatusMessages
        apiError={apiError}
        message={statusMessage}
        type={type}
        isVisible={isVisible}
      />

      <LoadingState
        loading={loading}
        isEmpty={!loading && filteredCities.length === 0 && !searchTerm}
      />

      {!loading && filteredCities.length > 0 && (
        <CitiesList
          cities={filteredCities}
          onDelete={handleDeleteCity}
          onUpdateRestriction={handleUpdateRestriction}
        />
      )}

      {!loading && restrictions && Object.keys(restrictions).length > 0 && filteredCities.length === 0 && searchTerm && (
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          No se encontraron ciudades que coincidan con "{searchTerm}".
        </p>
      )}
    </div>
  );
}

export default AdminPanel;