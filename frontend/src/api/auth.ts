import apiClient from "../lib/apiClient";
import { LoginFormData, RegisterFormData, User } from "../types/models";
import { API_ENDPOINTS } from "../lib/constants";

export interface LoginResponse {
  accessToken: any;
  access: string;
  refresh: string;
  user: User;
}

export const authApi = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    console.log('Données de connexion envoyées:', data);
    console.log('URL de connexion:', API_ENDPOINTS.AUTH.LOGIN);
    
    try {
      const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
        username: data.email,
        password: data.password
      });
      console.log('Réponse de connexion:', response.data);
      localStorage.setItem("cantine_jwt", response.data.access);
      localStorage.setItem("cantine_refresh_token", response.data.refresh);
      return response.data;
    } catch (error: any) {
      console.error('Erreur détaillée:', error.response?.data);
      throw error;
    }
  },

  register: async (data: RegisterFormData): Promise<User> => {
    console.log('Données d\'inscription envoyées:', data);
    console.log('URL d\'inscription:', API_ENDPOINTS.AUTH.REGISTER);
    
    try {
      const response = await apiClient.post<User>(API_ENDPOINTS.AUTH.REGISTER, {
        email: data.email,
        username: data.email,
        password: data.password,
        first_name: data.prenom,
        last_name: data.nom,
        institut: data.institut
      });
      console.log('Réponse d\'inscription:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur détaillée:', error.response?.data);
      throw error;
    }
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem("cantine_jwt");
  },

  refreshToken: async (): Promise<{ access: string }> => {
    const refreshToken = localStorage.getItem("cantine_refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh: refreshToken,
    });
    localStorage.setItem("cantine_jwt", response.data.access);
    return response.data;
  },

  updateUser: async (data: Partial<User>): Promise<User> => {
    console.log('Données de mise à jour envoyées:', data);
    console.log('URL de mise à jour:', API_ENDPOINTS.AUTH.UPDATE_USER);

    try {
      const response = await apiClient.put<User>(API_ENDPOINTS.AUTH.UPDATE_USER, data);
      console.log('Réponse de mise à jour:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur détaillée:', error.response?.data);
      throw error;
    }
  },
};

export const refreshToken = authApi.refreshToken;