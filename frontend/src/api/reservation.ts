import { apiClient } from './client';
import { Reservation, ApiResponse, ReservationRequest } from '../types/models';

export const reservationApi = {
  async getAll(): Promise<ApiResponse<Reservation[]>> {
    const response = await apiClient.get('/reservations/');
    return response.data;
  },

  async getByUser(userId: string): Promise<ApiResponse<Reservation[]>> {
    const response = await apiClient.get(`/reservations/user/${userId}/`);
    return response.data;
  },

  async create(data: ReservationRequest): Promise<ApiResponse<Reservation>> {
    const response = await apiClient.post('/reservations/', data);
    return response.data;
  },

  async update(id: number, data: Partial<Reservation>): Promise<ApiResponse<Reservation>> {
    const response = await apiClient.put(`/reservations/${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/reservations/${id}/`);
    return response.data;
  }
};
