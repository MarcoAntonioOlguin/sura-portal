// src/pages/RequestsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { getRequests } from "../api/requests";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userRole, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Filtrar solo las solicitudes creadas por el usuario (backend debe soportar esto)
      const data = await getRequests({ created_by: "me" });
      setRequests(data);
    } catch (err) {
      setError("Error al obtener solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Mis Solicitudes de Compra</h2>
      <button onClick={() => navigate("/requests/new")}>Nueva Solicitud</button>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem", width: "100%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.provider_name}</td>
                <td>{new Date(req.created_at).toLocaleDateString()}</td>
                <td>{req.total_amount}</td>
                <td>{req.status}</td>
                <td>
                  <button onClick={() => navigate(`/requests/${req.id}`)}>Ver</button>
                  {/* Aquí podrías permitir editar si está pendiente */}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>Aún no tienes solicitudes</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequestsPage;
