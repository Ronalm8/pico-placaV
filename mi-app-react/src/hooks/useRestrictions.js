import { useState, useEffect } from 'react';
import { getRestrictions } from '../services/api';

export const useRestrictions = () => {
    const [restrictions, setRestrictions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRestrictions = async () => {
        try {
            setLoading(true);
            const data = await getRestrictions();
            setRestrictions(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar restricciones:', err);
            setError('Error al cargar las restricciones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestrictions();
    }, []);

    return {
        restrictions,
        loading,
        error,
        reloadRestrictions: fetchRestrictions
    };
};