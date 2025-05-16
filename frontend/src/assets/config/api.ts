// Configuration de l'API

export const API_CONFIG = {
    // URL de base de l'API
    BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  
    // Endpoints de l'API
    ENDPOINTS: {
      // Authentification
      AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        ME: "/auth/me",
      },
  
      // Plats
      PLATS: {
        LIST: "/plats",
        DETAIL: (id: number) => `/plats/${id}`,
        CREATE: "/plats",
        UPDATE: (id: number) => `/plats/${id}`,
        DELETE: (id: number) => `/plats/${id}`,
      },
  
      // Réservations
      RESERVATIONS: {
        LIST: "/reservations",
        DETAIL: (id: number) => `/reservations/${id}`,
        CREATE: "/reservations",
        UPDATE: (id: number) => `/reservations/${id}`,
        DELETE: (id: number) => `/reservations/${id}`,
      },
  
      // Notifications
      NOTIFICATIONS: {
        LIST: "/notifications",
        MARK_AS_READ: (id: number) => `/notifications/${id}/read`,
      },
  
      // Admin
      ADMIN: {
        USERS: "/admin/users",
        STATS: "/admin/stats",
        EXPORT: "/admin/export",
      },
    },
  
    // Configuration des headers
    HEADERS: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  
    // Configuration du timeout
    TIMEOUT: 10000, // 10 secondes
  
    // Configuration des retries
    RETRIES: 3,
  
    // Configuration du cache
    CACHE: {
      ENABLED: true,
      TTL: 5 * 60 * 1000, // 5 minutes
    },
  } as const;
  
  // Configuration du WebSocket
  export const WS_CONFIG = {
    URL: import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/notifications/",
    RECONNECT_INTERVAL: 5000, // 5 secondes
    MAX_RECONNECT_ATTEMPTS: 5,
  } as const;