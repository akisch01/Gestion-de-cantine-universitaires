// Types spécifiques aux appels API

export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    institut: string;
  }
  
  export interface PlatRequest {
    nom_plat: string;
    description: string;
    prix: number;
    type_plat: 'standard' | 'vip' | 'vegetarien' | 'sans_gluten';
    image: string;
  }
  
  export interface ReservationRequest {
    plat: number;
    emploi_du_temps: number;
    quantite: number;
    supplements?: Record<string, any>;
  }
  
  export interface NotificationRequest {
    destinataire: number;
    titre: string;
    contenu: string;
    lien?: string;
  }

  export interface Notification {
    id: number;
    message: string;
    createdAt: string;
    read: boolean;
  }