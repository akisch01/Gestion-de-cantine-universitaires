import apiClient from "../lib/apiClient";
import { Parametre } from "../types/models";

export interface ParametreRequest {
  duree_expiration: number;
  heure_debut_service: string;
  heure_fin_service: string;
  max_reservations_par_jour: number;
}

export const parametresApi = {
  getAll: async (): Promise<Parametre[]> => {
    const response = await apiClient.get<Parametre[]>("/parametres/");
    return response.data;
  },

  getById: async (id: number): Promise<Parametre> => {
    const response = await apiClient.get<Parametre>(`/parametres/${id}/`);
    return response.data;
  },

  update: async (id: number, data: Partial<ParametreRequest>): Promise<Parametre> => {
    const response = await apiClient.patch<Parametre>(`/parametres/${id}/`, data);
    return response.data;
  },
}; 