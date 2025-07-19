import { useState, useMemo } from 'react';
import { normalize } from '../utils/normalize';
import { useAddCity, useDeleteCity } from '../hooks/restrictionsQueries';

export function useCitiesAdmin(restrictions, showMessage) {
  const [newCityName, setNewCityName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputError, setInputError] = useState('');

  const { mutateAsync: addCityMutation } = useAddCity();
  const { mutateAsync: deleteCityMutation } = useDeleteCity();

  const onlyLettersAndSpaces = (text) => {
    const filtered = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ.\s]/g, '');
    const hasInvalidChars = filtered.length !== text.length;
    return { filtered, hasInvalidChars };
  };

  const handleNewCityChange = (e) => {
    const raw = e.target.value;
    const { filtered, hasInvalidChars } = onlyLettersAndSpaces(raw);
    setNewCityName(filtered);
    if (hasInvalidChars) showMessage('No se permiten números ni caracteres especiales', true);
  };

  const handleSearchChange = (e) => {
    const raw = e.target.value;
    const { filtered, hasInvalidChars } = onlyLettersAndSpaces(raw);
    setSearchTerm(filtered);
    if (hasInvalidChars) showMessage('Solo se permiten letras y espacios en la búsqueda', true);
  };

  const handleAddCity = async () => {
    if (!newCityName.trim()) {
      setInputError('El nombre de la ciudad no puede estar vacío');
      return;
    }
    try {
      await addCityMutation({
        city: newCityName,
        weekTemplate: [
          { day: 'Lunes', plates: '0-0' },
          { day: 'Martes', plates: '0-0' },
          { day: 'Miércoles', plates: '0-0' },
          { day: 'Jueves', plates: '0-0' },
          { day: 'Viernes', plates: '0-0' },
          { day: 'Sábado', plates: 'Ninguna' },
          { day: 'Domingo', plates: 'Ninguna' }
        ],
      });
      showMessage(`Ciudad "${newCityName}" agregada correctamente`);
      setNewCityName('');
      setInputError('');
    } catch (error) {
      showMessage(error.message || 'Error al agregar la ciudad', true);
    }
  };

  const handleDeleteCity = async (city) => {
    if (window.confirm(`¿Estás seguro de eliminar la ciudad ${city}?`)) {
      try {
        await deleteCityMutation(city);
        showMessage(`Ciudad ${city} eliminada correctamente`);
      } catch (err) {
        showMessage(`Error al eliminar ${city}: ${err.message}`, true);
      }
    }
  };

  const filteredCities = useMemo(() => {
    if (!restrictions) return [];
    const normalizedSearch = normalize(searchTerm);
    return Object.entries(restrictions)
      .filter(([city]) => normalize(city).includes(normalizedSearch))
      .sort(([a], [b]) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  }, [restrictions, searchTerm]);

  return {
    newCityName,
    setNewCityName,
    searchTerm,
    setSearchTerm,
    inputError,
    setInputError,
    handleNewCityChange,
    handleSearchChange,
    handleAddCity,
    handleDeleteCity,
    filteredCities,
  };
}