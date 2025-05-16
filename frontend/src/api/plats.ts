import apiClient from "../lib/apiClient";
import { Plat, PlatRequest } from "../types/models";

export const platsApi = {
  getAll: async (): Promise<Plat[]> => {
    const response = await apiClient.get<Plat[]>("/api/plats");
    return response.data;
  },

  getById: async (id: number): Promise<Plat> => {
    const response = await apiClient.get<Plat>(`/api/plats/${id}`);
    return response.data;
  },

  create: async (data: PlatRequest): Promise<Plat> => {
    const response = await apiClient.post<Plat>("/api/plats", data);
    return response.data;
  },

  update: async (id: number, data: PlatRequest): Promise<Plat> => {
    const response = await apiClient.put<Plat>(`/api/plats/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`plats/${id}`);
  },
};