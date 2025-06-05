// src/pages/NewProviderPage.jsx
import React, { useState } from "react";
import { createProvider } from "../api/providers";
import { useNavigate } from "react-router-dom";

const NewProviderPage = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !address || !contact) {
      setError("Todos los campos son obligatorios");
      return;
    }
    try {
      await createProvider({ name, address, contact });
      navigate("/providers");
    } catch (err) {
      setError("Error al crear proveedor");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h2>Registrar Nuevo Proveedor</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Dirección:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contacto:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>
        <button type="submit">Guardar</button>
        <button type="button" onClick={() => navigate("/providers")} style={{ marginLeft: "1rem" }}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default NewProviderPage;
