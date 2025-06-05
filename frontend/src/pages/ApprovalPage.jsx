// src/pages/ApprovalPage.jsx
import React, { useEffect, useState } from "react";
import { getRequests, approveRequest, rejectRequest } from "../api/requests";
import { useNavigate } from "react-router-dom";

const ApprovalPage = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await getRequests({ status: "PENDIENTE" });
      setPending(data);
    } catch {
      setError("Error al obtener solicitudes pendientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      fetchPending();
    } catch {
      alert("No se pudo aprobar la solicitud");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      fetchPending();
    } catch {
      alert("No se pudo rechazar la solicitud");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Solicitudes Pendientes de Aprobación</h2>
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.provider_name}</td>
                <td>{new Date(req.created_at).toLocaleDateString()}</td>
                <td>{req.total_amount}</td>
                <td>
                  <button onClick={() => handleApprove(req.id)}>Aprobar</button>
                  <button
                    onClick={() => handleReject(req.id)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => navigate(`/requests/${req.id}`)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
            {pending.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No hay solicitudes pendientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApprovalPage;
