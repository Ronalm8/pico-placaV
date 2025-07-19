import React, { useCallback, useState } from 'react';

const RestrictionTable = ({
    city,
    restrictions,
    onUpdateRestriction,
    loading
}) => {
    const [editingStates, setEditingStates] = useState({});
    const [formState, setFormState] = useState(() =>
        restrictions.map(r => ({
            plates: r.plates || '',
            morningStart: r.schedules?.[0]?.start || '06:00',
            morningEnd: r.schedules?.[0]?.end || '09:30',
            afternoonStart: r.schedules?.[1]?.start || '16:00',
            afternoonEnd: r.schedules?.[1]?.end || '20:00'
        }))
    );

    const handleInputChange = (index, field, value) => {
        setFormState(prev =>
            prev.map((row, i) =>
                i === index ? { ...row, [field]: value } : row
            )
        );
    };

    const handleSave = useCallback(async (restriction, index) => {
        try {
            setEditingStates(prev => ({ ...prev, [restriction.day]: true }));

            const {
                plates,
                morningStart,
                morningEnd,
                afternoonStart,
                afternoonEnd
            } = formState[index];

            const schedules = [
                { start: morningStart, end: morningEnd },
                { start: afternoonStart, end: afternoonEnd }
            ];

            await onUpdateRestriction(city, restriction.day, plates, schedules);
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setEditingStates(prev => ({ ...prev, [restriction.day]: false }));
        }
    }, [city, onUpdateRestriction, formState]);

    return (
        <table className="restriction-table">
            <thead>
                <tr>
                    <th>Día</th>
                    <th>Placas</th>
                    <th>Horario Mañana</th>
                    <th>Horario Tarde</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {restrictions.map((restriction, index) => (
                    <tr key={`${city}-${index}`}>
                        <td data-label="Día">{restriction.day}</td>
                        <td data-label="Placas">
                            <input
                                type="text"
                                value={formState[index].plates}
                                disabled={editingStates[restriction.day]}
                                onChange={e => handleInputChange(index, 'plates', e.target.value)}
                                placeholder="Ej: 1-2"
                            />
                        </td>
                        <td data-label="Horario Mañana">
                            <div className="schedule-inputs">
                                <input
                                    type="time"
                                    value={formState[index].morningStart}
                                    disabled={editingStates[restriction.day]}
                                    onChange={e => handleInputChange(index, 'morningStart', e.target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="time"
                                    value={formState[index].morningEnd}
                                    disabled={editingStates[restriction.day]}
                                    onChange={e => handleInputChange(index, 'morningEnd', e.target.value)}
                                />
                            </div>
                        </td>
                        <td data-label="Horario Tarde">
                            <div className="schedule-inputs">
                                <input
                                    type="time"
                                    value={formState[index].afternoonStart}
                                    disabled={editingStates[restriction.day]}
                                    onChange={e => handleInputChange(index, 'afternoonStart', e.target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="time"
                                    value={formState[index].afternoonEnd}
                                    disabled={editingStates[restriction.day]}
                                    onChange={e => handleInputChange(index, 'afternoonEnd', e.target.value)}
                                />
                            </div>
                        </td>
                        <td>
                            <button
                                onClick={() => handleSave(restriction, index)}
                                disabled={loading || editingStates[restriction.day]}
                                className="save-button"
                            >
                                {editingStates[restriction.day] ? 'Guardando...' : 'Guardar'}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default React.memo(RestrictionTable);

