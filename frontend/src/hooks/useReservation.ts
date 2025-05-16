import { useState, useCallback } from "react";
import apiClient from "../lib/apiClient";
import { Reservation, ReservationRequest } from "../types/models";
import { AxiosError } from "axios";

interface ReservationState {
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
}

interface ApiErrorResponse {
  message?: string;
  status?: number;
  detail?: string;
  non_field_errors?: string[];
  [key: string]: any; // Pour les propriétés supplémentaires
}

export function useReservation() {
  const [state, setState] = useState<ReservationState>({
    reservations: [],
    isLoading: false,
    error: null,
  });

  // Récupération des réservations
  const fetchReservations = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await apiClient.get<Reservation[]>("/api/reservations/");
      setState({
        reservations: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setState({
        reservations: [],
        isLoading: false,
        error: axiosError.response?.data?.message || "Erreur lors de la récupération des réservations",
      });
    }
  }, []);

  // Création d'une réservation
  const createReservation = useCallback(async (data: ReservationRequest): Promise<Reservation> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      //console.log('Envoi de la requête de réservation avec les données:', data);
      const response = await apiClient.post<Reservation>("/api/reservations/", data);
      //console.log('Réponse du serveur:', response.data);
      
      setState(prev => ({
        ...prev,
        reservations: [...prev.reservations, response.data],
        isLoading: false,
      }));
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      // Créer une erreur personnalisée avec les détails de la réponse
      const customError = new Error("Erreur de réservation") as Error & {
        response?: {
          status?: number;
          data: any;
        };
      };
      
      customError.response = {
        status: axiosError.response?.status,
        data: axiosError.response?.data || {}
      };
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: axiosError.response?.data?.message || "Erreur lors de la création de la réservation"
      }));
      
      throw customError;
    }
  }, []);

  // Annulation d'une réservation
  const cancelReservation = useCallback(async (id: number): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await apiClient.delete(`/api/reservations/${id}/`);
      
      setState(prev => ({
        ...prev,
        reservations: prev.reservations.filter(r => r.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: axiosError.response?.data?.message || "Erreur lors de l'annulation de la réservation",
      }));
      
      throw error;
    }
  }, []);

  return {
    reservations: state.reservations,
    isLoading: state.isLoading,
    error: state.error,
    fetchReservations,
    createReservation,
    cancelReservation,
  };
}