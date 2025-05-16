// Configuration des routes de l'application

export const ROUTES = {
    // Routes publiques
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    NOT_FOUND: "/404",
  
    // Routes étudiant
    STUDENT: {
      MENU: "/menu",
      RESERVATION: "/reservation",
      HISTORY: "/historique",
      PROFILE: "/profil",
      NOTIFICATIONS: "/notifications",
    },
  
    // Routes admin
    ADMIN: {
      DASHBOARD: "/admin/dashboard",
      PLATS: "/admin/plats",
      EMPLOI_DU_TEMPS: "/admin/emploi-du-temps",
      PARAMETRES: "/admin/parametres",
      AVIS: "/admin/avis",
      USERS: "/admin/utilisateurs",
      PROFILE: "/admin/profil",
    },
  } as const;
  
  // Configuration des routes protégées
  export const PROTECTED_ROUTES = {
    STUDENT: [
      ROUTES.STUDENT.MENU,
      ROUTES.STUDENT.RESERVATION,
      ROUTES.STUDENT.HISTORY,
      ROUTES.STUDENT.PROFILE,
      ROUTES.STUDENT.NOTIFICATIONS,
    ],
    ADMIN: [
      ROUTES.ADMIN.DASHBOARD,
      ROUTES.ADMIN.PLATS,
      ROUTES.ADMIN.EMPLOI_DU_TEMPS,
      ROUTES.ADMIN.PARAMETRES,
      ROUTES.ADMIN.AVIS,
      ROUTES.ADMIN.USERS,
      ROUTES.ADMIN.PROFILE,
    ],
  } as const;
  
  // Configuration des routes publiques
  export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.NOT_FOUND,
  ] as const;
  
  // Configuration des routes par défaut
  export const DEFAULT_ROUTES = {
    STUDENT: ROUTES.STUDENT.MENU,
    ADMIN: ROUTES.ADMIN.DASHBOARD,
  } as const;