export const normalize = (value) =>
  value
    .replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ.\s]/g, '')        
    .replace(/\s+/g, ' ')                            
    .trim()
    .toLowerCase()
    .replace(/(^|[\s.])([a-záéíóúñ])/g, (_, sep, char) => sep + char.toUpperCase());
