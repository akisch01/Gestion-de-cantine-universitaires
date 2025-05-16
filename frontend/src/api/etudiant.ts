import apiClient from "../lib/apiClient";
import { Reservation, Avis, Notification } from "../types/models";

export const etudiantApi = {
  // Réservations
  getAllReservations: async (): Promise<Reservation[]> => {
    const response = await apiClient.get<Reservation[]>("/reservations/");
    return response.data;
  },

  getReservationById: async (id: number): Promise<Reservation> => {
    const response = await apiClient.get<Reservation>(`/reservations/${id}/`);
    return response.data;
  },

  createReservation: async (data: Partial<Reservation>): Promise<Reservation> => {
    const response = await apiClient.post<Reservation>("/reservations/create/", data);
    return response.data;
  },

  cancelReservation: async (id: number): Promise<void> => {
    await apiClient.post(`/reservations/${id}/cancel/`);
  },

  // Avis
  getAvisByPlat: async (platId: number): Promise<Avis[]> => {
    const response = await apiClient.get<Avis[]>(`/plats/${platId}/avis/`);
    return response.data;
  },

  createAvis: async (data: Partial<Avis>): Promise<Avis> => {
    const response = await apiClient.post<Avis>("/avis/", data);
    return response.data;
  },

  updateAvis: async (id: number, data: Partial<Avis>): Promise<Avis> => {
    const response = await apiClient.put<Avis>(`/avis/${id}/`, data);
    return response.data;
  },

  deleteAvis: async (id: number): Promise<void> => {
    await apiClient.delete(`/avis/${id}/`);
  },

  // Notifications
  getAllNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>("/api/notifications/");
    return response.data;
  },

  markNotificationAsRead: async (id: number): Promise<Notification> => {
    const response = await apiClient.post<Notification>(`/api/notifications/${id}/read/`);
    return response.data;
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    await apiClient.post("/api/notifications/read-all/");
  },
}; 