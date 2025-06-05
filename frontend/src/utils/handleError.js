// src/utils/handleErrors.js
export const getErrorMessage = (err) => {
    if (err.response && err.response.data) {
      // si retorna un objeto con claves y mensajes:
      const data = err.response.data;
      if (typeof data === "string") return data;
      if (data.detail) return data.detail;
      // concatenar todos los mensajes si es un dict
      return Object.values(data).flat().join(" ");
    }
    return "Error inesperado";
  };
  