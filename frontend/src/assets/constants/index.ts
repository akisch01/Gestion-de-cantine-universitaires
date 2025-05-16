// Constantes globales de l'application

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
export const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/notifications/";
export const JWT_STORAGE_KEY = "cantine_jwt";
export const USER_ROLE_KEY = "cantine_role";
export const NOTIF_STORAGE_KEY = "cantine_notifications";

// Constantes pour les rôles
export const ROLES = {
  STUDENT: "etudiant",
  ADMIN: "admin",
} as const;

// Constantes pour les statuts de réservation
export const RESERVATION_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
} as const;

// Constantes pour les catégories de plats
export const PLAT_CATEGORIES = {
  ENTREE: "entree",
  PLAT: "plat",
  DESSERT: "dessert",
  BOISSON: "boisson",
} as const;

// Constantes pour les types de notifications
export const NOTIFICATION_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

// Constantes pour les messages d'erreur
export const ERROR_MESSAGES = {
  LOGIN_FAILED: "Échec de la connexion. Vérifiez vos identifiants.",
  REGISTER_FAILED: "Échec de l'inscription. Veuillez réessayer.",
  RESERVATION_FAILED: "Échec de la réservation. Veuillez réessayer.",
  UPDATE_FAILED: "Échec de la mise à jour. Veuillez réessayer.",
  DELETE_FAILED: "Échec de la suppression. Veuillez réessayer.",
} as const;

// Constantes pour les messages de succès
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Connexion réussie !",
  REGISTER_SUCCESS: "Inscription réussie !",
  RESERVATION_SUCCESS: "Réservation réussie !",
  UPDATE_SUCCESS: "Mise à jour réussie !",
  DELETE_SUCCESS: "Suppression réussie !",
} as const;