import { apiClient } from "./client";


export const clientApi = {
  // Export des réservations de l'étudiant
  exportReservations: async (reservations: any[]): Promise<Blob> => {
    // Extraire les IDs des réservations
    const reservationIds = reservations.map(r => r.id);
    
    // Utiliser GET avec les IDs comme paramètres de requête
    const response = await apiClient.get('reservations/export/', {
      params: { ids: reservationIds.join(',') },
      responseType: 'blob'
    });

    return response.data;
  },

  // Autres méthodes client
  getHistorique: async () => {
    const response = await apiClient.get("/client/historique");
    return response.data;
  },

  getSolde: async (): Promise<number> => {
    const response = await apiClient.get<number>('/solde');
    return response.data;
  }
};
