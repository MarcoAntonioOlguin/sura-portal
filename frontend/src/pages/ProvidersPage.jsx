// src/pages/ProvidersPage.jsx
import React, { useEffect, useState } from "react";
import { getProviders, deleteProvider } from "../api/providers";
import { Link, useNavigate } from "react-router-dom";

const ProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await getProviders();
      setProviders(data);
    } catch (err) {
      setError("Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este proveedor?")) return;
    try {
      await deleteProvider(id);
      fetchProviders();
    } catch {
      alert("No se pudo eliminar el proveedor");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Lista de Proveedores</h2>
      <button onClick={() => navigate("/providers/new")}>Nuevo Proveedor</button>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem", width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((prov) => (
              <tr key={prov.id}>
                <td>{prov.id}</td>
                <td>{prov.name}</td>
                <td>{prov.address}</td>
                <td>{prov.contact}</td>
                <td>
                  <button onClick={() => navigate(`/providers/edit/${prov.id}`)}>Editar</button>
                  <button onClick={() => handleDelete(prov.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {providers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No hay proveedores</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProvidersPage;
