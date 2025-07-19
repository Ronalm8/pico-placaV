import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getRestrictions, updateRestriction as apiUpdateRestriction } from '../services/api';

const RestrictionsContext = createContext();

export function RestrictionsProvider({ children }) {
    const [restrictions, setRestrictions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCity, setSelectedCity] = useState('');

    const fetchRestrictions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getRestrictions();
            setRestrictions(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching restrictions:', err);
            setError('Error al cargar las restricciones');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateRestriction = useCallback(async (city, day, newPlates) => {
        try {
            const result = await apiUpdateRestriction(city, day, newPlates);
            if (result) {
                setRestrictions(prevState => ({
                    ...prevState,
                    [city]: prevState[city].map(restriction =>
                        restriction.day === day
                            ? { ...restriction, plates: newPlates }
                            : restriction
                    )
                }));
                return { success: true };
            }
        } catch (err) {
            console.error('Error updating restriction:', err);
            return { success: false, error: err.message };
        }
    }, []);

    useEffect(() => {
        fetchRestrictions();
    }, [fetchRestrictions]);

    const value = {
        restrictions,
        loading,
        error,
        updateRestriction,
        fetchRestrictions,
        selectedCity,
        setSelectedCity
    };

    return (
        <RestrictionsContext.Provider value={value}>
            {children}
        </RestrictionsContext.Provider>
    );
}

export function useRestrictions() {
    const context = useContext(RestrictionsContext);
    if (!context) {
        throw new Error('useRestrictions debe usarse dentro de un RestrictionsProvider');
    }
    return context;
}
