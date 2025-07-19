const API_URL = '/api';

export const getRestrictions = async () => {
    try {
        console.log('Solicitando restricciones...');
        const response = await fetch(`${API_URL}/restrictions`);
        
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const text = await response.text();
        console.log('Respuesta del servidor:', text);

        try {
            return JSON.parse(text);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            throw new Error('Respuesta inválida del servidor');
        }
    } catch (error) {
        console.error('Error en getRestrictions:', error);
        throw error;
    }
};

export const addCity = async (city, weekTemplate) => {
    try {
        console.log('Iniciando petición para agregar ciudad:', city);
        
        const response = await fetch(`${API_URL}/restrictions/${city}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(weekTemplate),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Error al agregar ciudad:', data);
            throw { 
                code: data.code || 'ERROR',
                message: data.error || `Error al agregar la ciudad ${city}`
            };
        }

        console.log('Ciudad agregada exitosamente:', {
            ciudad: city,
            respuesta: data
        });

        return { 
            success: true, 
            data: data.data,
            message: data.message
        };
    } catch (error) {
        console.error('Error en addCity:', error);
        throw {
            code: error.code || 'ERROR',
            message: error.message || `Error inesperado al agregar la ciudad ${city}`
        };
    }
};

export const updateRestriction = async (city, day, plates, schedules) => {
  try {
    const response = await fetch(`${API_URL}/restrictions/${city}/${day}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plates, schedules }), 
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar la restricción');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating restriction:', error);
    throw error;
  }
};

export const deleteCity = async (city) => {
    try {
        console.log('Eliminando ciudad:', city);
        const response = await fetch(`${API_URL}/restrictions/${city}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        console.log('Ciudad eliminada:', data);
        return data;
    } catch (error) {
        console.error('Error al eliminar ciudad:', error);
        throw error;
    }
};

