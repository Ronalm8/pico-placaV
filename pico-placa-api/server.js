const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { z } = require('zod');

const app = express();
const RESTRICTIONS_FILE = path.join(__dirname, 'restrictions.json');


const cityNameSchema = z.string({
    required_error: "El nombre de la ciudad es requerido.",
    invalid_type_error: "El nombre de la ciudad debe ser texto.",
})
.trim()
.min(3, { 
    message: "El nombre de la ciudad debe tener al menos 3 caracteres." 
})
.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ.\s]+$/, { 
    message: "El nombre de la ciudad solo puede contener letras y espacios." 
});

const platesSchema = z.string({
    required_error: "El valor de las placas es requerido.",
    invalid_type_error: "El valor de las placas debe ser texto.",
})
.trim()
.min(1, { message: "El valor de las placas no puede estar vacío." });


const validateCity = (req, res, next) => {
    try {
        const cityName = req.params.city;
        cityNameSchema.parse(cityName);
        next();
    } catch (error) {
        res.status(400).json({ 
            error: error.errors[0].message 
        });
    }
};

const validatePlates = (req, res, next) => {
    try {
        const { plates } = req.body;
        platesSchema.parse(plates);
        next();
    } catch (error) {
        res.status(400).json({ 
            error: error.errors[0].message 
        });
    }
};

app.use(cors());
app.use(express.json());

app.get('/api/restrictions', async (req, res) => {
    try {
        const data = await fs.readFile(RESTRICTIONS_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error al leer las restricciones' });
    }
});

app.post('/api/restrictions/:city', validateCity, async (req, res) => {
    try {
        const cityName = req.params.city.toLowerCase();
        const weekTemplate = req.body;

        const data = await fs.readFile(RESTRICTIONS_FILE, 'utf8');
        const restrictions = JSON.parse(data);

        if (restrictions[cityName]) {
            return res.status(400).json({ error: 'La ciudad ya existe' });
        }

        restrictions[cityName] = weekTemplate;
        await fs.writeFile(RESTRICTIONS_FILE, JSON.stringify(restrictions, null, 2));
        
        res.status(201).json({ message: 'Ciudad agregada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar la ciudad' });
    }
});

app.delete('/api/restrictions/:city', async (req, res) => {
    try {
        const cityName = req.params.city.toLowerCase();
        const data = await fs.readFile(RESTRICTIONS_FILE, 'utf8');
        const restrictions = JSON.parse(data);

        if (!restrictions[cityName]) {
            return res.status(404).json({ error: 'Ciudad no encontrada' });
        }

        delete restrictions[cityName];
        await fs.writeFile(RESTRICTIONS_FILE, JSON.stringify(restrictions, null, 2));
        
        res.json({ message: 'Ciudad eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la ciudad' });
    }
});

app.put('/api/restrictions/:city/:day', async (req, res) => {
    const { city, day } = req.params;
    const { plates, schedules } = req.body;

    try {
        console.log('Recibido:', { city, day, plates, schedules }); // Para debug

        // Validar datos
        if (!plates || !schedules || !Array.isArray(schedules)) {
            return res.status(400).json({ 
                error: 'Datos incompletos o inválidos' 
            });
        }

        // Leer el archivo actual
        const data = JSON.parse(await fs.readFile('./restrictions.json', 'utf8'));

        // Encontrar y actualizar la restricción
        const cityRestrictions = data[city];
        if (!cityRestrictions) {
            return res.status(404).json({ error: 'Ciudad no encontrada' });
        }

        const restrictionIndex = cityRestrictions.findIndex(r => r.day === day);
        if (restrictionIndex === -1) {
            return res.status(404).json({ error: 'Día no encontrado' });
        }

        // Actualizar los datos
        data[city][restrictionIndex] = {
            ...data[city][restrictionIndex],
            plates,
            schedules
        };

        // Guardar cambios
        await fs.writeFile('./restrictions.json', JSON.stringify(data, null, 2));

        res.json({ success: true });
    } catch (error) {
        console.error('Error en servidor:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});