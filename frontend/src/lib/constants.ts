// Configuration de l'API
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Configuration de l'authentification
export const JWT_STORAGE_KEY = "token";
export const USER_ROLE_KEY = "user_role";

// Constantes globales de l'application
export const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/notifications/";
export const NOTIF_STORAGE_KEY = "cantine_notifications";

// Endpoints API
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/api/auth/token/obtain/",
        REGISTER: "/api/auth/register/",
        ME: "/api/users/me/",
        LOGOUT: "/api/auth/logout/",
        REFRESH: "/api/auth/token/refresh/",
        UPDATE_USER: "/api/users/update/",
    },
    PLATS: {
        LIST: "/api/plats/",
        DETAIL: (id: number) => `/api/plats/${id}/`,
    },
    RESERVATIONS: {
        LIST: "/api/reservations/",
        DETAIL: (id: number) => `/api/reservations/${id}/`,
        CREATE: "/api/reservations/create/",
        CANCEL: (id: number) => `/api/reservations/${id}/cancel/`,
    },
    ADMIN: {
        USERS: "/api/users/",
        PLATS: "/api/plats/",
        EMPLOI_DU_TEMPS: "/api/emploi-du-temps/",
        PARAMETRES: "/api/parametres/",
        AVIS: "/api/avis/",
        STATS: "/api/admin/stats/",
        EXPORT: (date: string) => `/api/admin/export/reservations/?date=${date}`,
    },
    ETUDIANT: {
        RESERVATIONS: "/api/reservations/",
        AVIS: "/api/avis/",
        NOTIFICATIONS: "/api/notifications/",
    },
} as const;