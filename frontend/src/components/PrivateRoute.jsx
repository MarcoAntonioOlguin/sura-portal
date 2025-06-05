// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

// rolesPermitidos: arreglo de strings, p. ej. ["colocador", "aprobador"]
const PrivateRoute = ({ rolesPermitidos }) => {
  const { accessToken, userRole } = useContext(AuthContext);

  if (!accessToken) {
    // No está logueado: redirige al login
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(userRole)) {
    // Usuario autenticado pero sin rol permitido
    return <div style={{ padding: "2rem" }}>
      <h2>Acceso denegado</h2>
      <p>No tienes permisos para ver esta página.</p>
    </div>;
  }

  // Si está autenticado y rol permitido, renderiza la ruta hija
  return <Outlet />;
};

export default PrivateRoute;
