// src/api/requests.js
import client from "./client";

// Obtener todas las solicitudes (filtrar por usuario/estado desde el backend)
export const getRequests = async (params = {}) => {
  // params puede incluir ?status=PENDIENTE o ?user_id=...
  const response = await client.get("/requests/", { params });
  return response.data;
};

export const getRequestById = async (id) => {
  const response = await client.get(`/requests/${id}/`);
  return response.data;
};

export const createRequest = async (requestData) => {
  const response = await client.post("/requests/", requestData);
  return response.data;
};

export const updateRequest = async (id, requestData) => {
  const response = await client.put(`/requests/${id}/`, requestData);
  return response.data;
};

export const approveRequest = async (id) => {
  const response = await client.post(`/requests/${id}/approve/`);
  return response.data;
};

export const rejectRequest = async (id) => {
  const response = await client.post(`/requests/${id}/reject/`);
  return response.data;
};