// src/utils/validators.js
import * as yup from "yup";

export const providerSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),
  address: yup
    .string()
    .required("La dirección es obligatoria")
    .min(5, "Debe tener al menos 5 caracteres"),
  contact: yup
    .string()
    .required("El contacto es obligatorio")
    .email("Debe ser un correo válido"),
});
