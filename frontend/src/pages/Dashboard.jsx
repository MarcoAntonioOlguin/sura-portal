// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Dashboard = () => {
  const { userRole, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bienvenido al Portal de Proveedores</h1>
      <button onClick={logout} style={{ float: "right" }}>Cerrar Sesión</button>
      {userRole === "colocador" && (
        <>
          <h3>Menú Colocador</h3>
          <ul>
            <li><Link to="/providers">Gestionar Proveedores</Link></li>
            <li><Link to="/requests">Mis Solicitudes de Compra</Link></li>
            <li><Link to="/requests/new">Crear Nueva Solicitud</Link></li>
          </ul>
        </>
      )}
      {userRole === "aprobador" && (
        <>
          <h3>Menú Aprobador</h3>
          <ul>
            <li><Link to="/approval">Solicitudes Pendientes</Link></li>
          </ul>
        </>
      )}
    </div>
  );
};

export default Dashboard;
