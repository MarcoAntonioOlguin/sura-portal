// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { login as loginApi, logout as logoutApi } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const existingToken = localStorage.getItem("access_token");
  const existingRole = localStorage.getItem("user_role");

  const [accessToken, setAccessToken] = useState(existingToken || null);
  const [userRole, setUserRole] = useState(existingRole || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await loginApi(username, password);
      // data: { access, refresh, user: { id, username, role } }
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user_role", data.user.role);
      setAccessToken(data.access);
      setUserRole(data.user.role);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Error de autenticación");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutApi();
    setAccessToken(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, userRole, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
