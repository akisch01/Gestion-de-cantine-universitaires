import apiClient from "../lib/apiClient";
import { User, Plat, EmploiDuTemps, Parametre, Avis } from "../types/models";

export const adminApi = {
  // Gestion des utilisateurs
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>("/admin/users");
    return response.data;
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },

  // Gestion des plats
  getAllPlats: async (): Promise<Plat[]> => {
    const response = await apiClient.get<Plat[]>("/admin/plats");
    return response.data;
  },

  createPlat: async (data: Partial<Plat>): Promise<Plat> => {
    const response = await apiClient.post<Plat>("/admin/plats", data);
    return response.data;
  },

  updatePlat: async (id: number, data: Partial<Plat>): Promise<Plat> => {
    const response = await apiClient.put<Plat>(`/admin/plats/${id}`, data);
    return response.data;
  },

  deletePlat: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/plats/${id}`);
  },

  // Gestion de l'emploi du temps
  getAllEmploiDuTemps: async (): Promise<EmploiDuTemps[]> => {
    const response = await apiClient.get<EmploiDuTemps[]>("/admin/emploi-du-temps");
    return response.data;
  },

  createEmploiDuTemps: async (data: Partial<EmploiDuTemps>): Promise<EmploiDuTemps> => {
    const response = await apiClient.post<EmploiDuTemps>("/admin/emploi-du-temps", data);
    return response.data;
  },

  updateEmploiDuTemps: async (id: number, data: Partial<EmploiDuTemps>): Promise<EmploiDuTemps> => {
    const response = await apiClient.put<EmploiDuTemps>(`/admin/emploi-du-temps/${id}`, data);
    return response.data;
  },

  deleteEmploiDuTemps: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/emploi-du-temps/${id}`);
  },

  // Gestion des paramètres
  getParametres: async (): Promise<Parametre[]> => {
    const response = await apiClient.get<Parametre[]>("/admin/parametres");
    return response.data;
  },

  updateParametre: async (id: number, data: Partial<Parametre>): Promise<Parametre> => {
    const response = await apiClient.put<Parametre>(`/admin/parametres/${id}`, data);
    return response.data;
  },

  // Gestion des avis
  getAllAvis: async (): Promise<Avis[]> => {
    const response = await apiClient.get<Avis[]>("/admin/avis");
    return response.data;
  },

  approuverAvis: async (id: number): Promise<Avis> => {
    const response = await apiClient.post<Avis>(`/admin/avis/${id}/approuver`);
    return response.data;
  },

  desapprouverAvis: async (id: number): Promise<Avis> => {
    const response = await apiClient.post<Avis>(`/admin/avis/${id}/desapprouver`);
    return response.data;
  },

  // Statistiques
  getStats: async () => {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  },

  // Export PDF
  exportReservations: async (date: string): Promise<Blob> => {
    const response = await apiClient.get(`/admin/export/reservations?date=${date}`, {
      responseType: "blob",
    });
    return response.data;
  },
};