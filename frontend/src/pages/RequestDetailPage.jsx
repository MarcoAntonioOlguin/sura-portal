// src/pages/RequestDetailPage.jsx
import React, { useEffect, useState } from "react";
import { getRequestById, approveRequest, rejectRequest } from "../api/requests";
import { useParams, useNavigate } from "react-router-dom";

const RequestDetailPage = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRequest = async () => {
    setLoading(true);
    try {
      const data = await getRequestById(id);
      setRequest(data);
    } catch {
      setError("Error al cargar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const handleApprove = async () => {
    try {
      await approveRequest(id);
      navigate("/approval");
    } catch {
      alert("No se pudo aprobar");
    }
  };

  const handleReject = async () => {
    try {
      await rejectRequest(id);
      navigate("/approval");
    } catch {
      alert("No se pudo rechazar");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!request) return null;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Detalle de Solicitud #{request.id}</h2>
      <p>
        <strong>Proveedor:</strong> {request.provider_name}
      </p>
      <p>
        <strong>Fecha:</strong> {new Date(request.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Estado:</strong> {request.status}
      </p>
      <h4>Ítems</h4>
      <table border="1" cellPadding="8" style={{ width: "100%", marginBottom: "1rem" }}>
        <thead>
          <tr>
            <th>Producto (enlace)</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {request.items.map((item) => (
            <tr key={item.id}>
              <td>
                <a href={item.product_link} target="_blank" rel="noreferrer">
                  {item.product_link}
                </a>
              </td>
              <td>{item.quantity}</td>
              <td>${item.unit_price.toFixed(2)}</td>
              <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <strong>Total:</strong> ${request.total_amount.toFixed(2)}
      </p>

      {request.status === "PENDIENTE" && (
        <div>
          <button onClick={handleApprove}>Aprobar</button>
          <button onClick={handleReject} style={{ marginLeft: "1rem" }}>
            Rechazar
          </button>
        </div>
      )}
      <button onClick={() => navigate("/approval")} style={{ marginTop: "1rem" }}>
        Volver
      </button>
    </div>
  );
};

export default RequestDetailPage;
