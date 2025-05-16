import { apiClient } from './client';
import { EmploiDuTemps } from "../types/models";

export interface EmploiDuTempsRequest {
  date: string;
  heure_debut: string;
  heure_fin: string;
  quantite_disponible: number;
  plat: number;
}

export const emploiDuTempsApi = {
  getAll: async (): Promise<EmploiDuTemps[]> => {
    const response = await apiClient.get<EmploiDuTemps[]>('/emploi-du-temps/');
    return response.data;
  },

  getById: async (id: number): Promise<EmploiDuTemps> => {
    const response = await apiClient.get<EmploiDuTemps>(`/emploi-du-temps/${id}/`);
    return response.data;
  },

  create: async (data: EmploiDuTempsRequest): Promise<EmploiDuTemps> => {
    const response = await apiClient.post<EmploiDuTemps>("/emploi-du-temps/", data);
    return response.data;
  },

  update: async (id: number, data: Partial<EmploiDuTempsRequest>): Promise<EmploiDuTemps> => {
    const response = await apiClient.patch<EmploiDuTemps>(`/emploi-du-temps/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/emploi-du-temps/${id}/`);
  },
}; 