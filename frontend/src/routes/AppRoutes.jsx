// src/routes/AppRoutes.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import ProvidersPage from "../pages/ProvidersPage";
import NewProviderPage from "../pages/NewProviderPage";
import RequestsPage from "../pages/RequestsPage";
import NewRequestPage from "../pages/NewRequestPage";
import ApprovalPage from "../pages/ApprovalPage";
import RequestDetailPage from "../pages/RequestDetailPage";

import PrivateRoute from "../components/PrivateRoute";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard principal, requiere login cualquiera de los dos roles */}
          <Route element={<PrivateRoute rolesPermitidos={["colocador", "aprobador"]} />}>
            <Route path="/" element={<Dashboard />} />
          </Route>

          {/* Rutas para colocador */}
          <Route element={<PrivateRoute rolesPermitidos={["colocador"]} />}>
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/providers/new" element={<NewProviderPage />} />
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/requests/new" element={<NewRequestPage />} />
          </Route>

          {/* Rutas para aprobador */}
          <Route element={<PrivateRoute rolesPermitidos={["aprobador"]} />}>
            <Route path="/approval" element={<ApprovalPage />} />
            <Route path="/requests/:id" element={<RequestDetailPage />} />
          </Route>

          {/* Si la ruta no coincide, redirigir a dashboard (o login) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;
