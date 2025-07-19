import { z } from 'zod';
import { normalize } from './normalize'; 


export const cityNameSchema = z.string({
    required_error: "El nombre de la ciudad es requerido.",
    invalid_type_error: "El nombre de la ciudad debe ser texto.",
  })
  .trim()
  .min(1, { message: "El nombre de la ciudad no puede estar vacío." })
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ.\s]+$/, { message: "El nombre de la ciudad solo puede contener letras y espacios." })
  .transform(val => normalize(val)); 


export const platesSchema = z.string({
    required_error: "El valor de las placas es requerido.",
    invalid_type_error: "El valor de las placas debe ser texto.",
  })
  .trim()
  .min(1, { message: "El valor de las placas no puede estar vacío." });
