import apiClient from "../lib/apiClient";
import { Notification, NotificationRequest } from "../types/models";

export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>("/notifications");
    return response.data;
  },

  getById: async (id: number): Promise<Notification> => {
    const response = await apiClient.get<Notification>(`/notifications/${id}`);
    return response.data;
  },

  create: async (data: NotificationRequest): Promise<Notification> => {
    const response = await apiClient.post<Notification>("/notifications", data);
    return response.data;
  },

  markAsRead: async (id: number): Promise<Notification> => {
    const response = await apiClient.put<Notification>(`/notifications/${id}/read`, {});
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },
};