import apiClient from "../lib/apiClient";
import { Reservation, ReservationRequest } from "../types/models";

export const reservationsApi = {
  getAll: async (): Promise<Reservation[]> => {
    const response = await apiClient.get<Reservation[]>("/api/reservations");
    return response.data;
  },

  getById: async (id: number): Promise<Reservation> => {
    const response = await apiClient.get<Reservation>(`/api/reservations/${id}`);
    return response.data;
  },

  create: async (data: ReservationRequest): Promise<Reservation> => {
    const response = await apiClient.post<Reservation>("/api/reservations", data);
    return response.data;
  },

  update: async (id: number, data: ReservationRequest): Promise<Reservation> => {
    const response = await apiClient.put<Reservation>(`/api/reservations/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/reservations/${id}`);
  },
};