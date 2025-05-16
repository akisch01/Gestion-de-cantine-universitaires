import { apiClient } from './client';
import { Avis } from "../types/models";

export interface AvisRequest {
  plat_id: number;
  note: number;
  commentaire: string;
}

export const avisApi = {
  // Récupère tous les avis (filtrés selon l'utilisateur)
  getAll: async (platId?: number, onlyApproved?: boolean): Promise<Avis[]> => {
    const params: { plat?: number; approuve?: boolean } = {};
    if (platId) params.plat = platId;
    if (onlyApproved) params.approuve = true;
    const response = await apiClient.get("/avis/", { params });
    return response.data;
  },

  // Récupère les avis pour un plat spécifique
  getByPlatId: async (platId: number, onlyApproved?: boolean): Promise<Avis[]> => {
    const params: { plat: number; approuve?: boolean } = { plat: platId };
    if (onlyApproved) params.approuve = true;
    const response = await apiClient.get("/avis/", { params });
    return response.data;
  },

  create: async (data: AvisRequest): Promise<Avis> => {
    const response = await apiClient.post("/avis/", data);
    return response.data;
  },

  update: async (id: number, data: Partial<AvisRequest>): Promise<Avis> => {
    const response = await apiClient.put(`/avis/${id}/`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/avis/${id}/`);
  },

  approuver: async (id: number): Promise<Avis> => {
    const response = await apiClient.post(`/avis/${id}/approuver/`);
    return response.data;
  },

  desapprouver: async (id: number): Promise<Avis> => {
    const response = await apiClient.post(`/avis/${id}/desapprouver/`);
    return response.data;
  },
}; 