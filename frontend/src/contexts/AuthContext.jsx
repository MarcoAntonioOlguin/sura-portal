// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Estado para token y usuario decodificado
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        return jwtDecode(token);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. LOGIN
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Credenciales inválidas");

      const data = await response.json(); // { access, refresh }
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      setAccessToken(data.access);

      const decoded = jwtDecode(data.access);
      setUser(decoded);
    } catch (err) {
      setError(err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // 3. LOGOUT
  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // 4. REFRESCAR access token
  const refreshAccess = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      logout();
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!response.ok) throw new Error("No se pudo refrescar el token");

      const data = await response.json(); // { access: "nuevo_token" }
      localStorage.setItem("accessToken", data.access);
      setAccessToken(data.access);

      const decoded = jwtDecode(data.access);
      setUser(decoded);
    } catch (err) {
      console.warn("[AuthContext] Falló refresh token:", err);
      logout();
    }
  };

  // 5. Chequeo inicial de expiración (solo al montar)
  useEffect(() => {
    if (accessToken) {
      try {
        const { exp } = jwtDecode(accessToken);
        if (exp * 1000 < Date.now()) {
          logout();
        }
      } catch {
        logout();
      }
    }
  }, []);

  // 6. Intervalo de refresco automático (cada 4 minutos)
  useEffect(() => {
    if (accessToken) {
      const id = setInterval(() => {
        refreshAccess();
      }, 1000 * 60 * 4);
      return () => clearInterval(id);
    }
  }, [accessToken]);

  // 7. Fetch personalizado con token (reintento si expira)
  const fetchWithAuth = async (url, options = {}) => {
    let token = accessToken;
    if (!token) throw new Error("No hay access token para autorizar");

    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const mergedOptions = {
      ...options,
      headers: { ...defaultHeaders, ...(options.headers || {}) },
    };

    let res = await fetch(url, mergedOptions);
    if (res.status === 401) {
      // Intentar refrescar
      await refreshAccess();
      const newToken = localStorage.getItem("accessToken");
      if (!newToken) {
        logout();
        throw new Error("Token expirado, requiere iniciar sesión de nuevo");
      }

      // Repetir la llamada con el token nuevo
      const retryHeaders = {
        ...defaultHeaders,
        Authorization: `Bearer ${newToken}`,
        ...(options.headers || {}),
      };
      const retryOptions = { ...options, headers: retryHeaders };
      res = await fetch(url, retryOptions);
    }

    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        error,
        login,
        logout,
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
