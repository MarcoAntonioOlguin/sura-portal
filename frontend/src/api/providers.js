// src/api/providers.js
import client from "./client";

export const getProviders = async () => {
  const response = await client.get("/providers/");
  return response.data;
};

export const getProviderById = async (id) => {
  const response = await client.get(`/providers/${id}/`);
  return response.data;
};

export const createProvider = async (providerData) => {
  const response = await client.post("/providers/", providerData);
  return response.data;
};

export const updateProvider = async (id, providerData) => {
  const response = await client.put(`/providers/${id}/`, providerData);
  return response.data;
};

export const deleteProvider = async (id) => {
  const response = await client.delete(`/providers/${id}/`);
  return response.status === 204;
};
