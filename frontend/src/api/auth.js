// src/api/auth.js
import client from "./client";

export const login = async (username, password) => {
  const response = await client.post("/auth/login/", {
    username,
    password,
  });
  return response.data; // se espera { access: "...", refresh: "...", user: { id, username, role } }
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_role");
};
