import { ReactNode } from "react";


export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  institut: string;
  is_staff: boolean;
}

export interface Plat {
  id: number;
  nom_plat: string;
  description: string;
  prix: number;
  type_plat: 'standard' | 'vip' | 'vegetarien' | 'sans_gluten';
  image: string;
  image_url?: string; // URL complète de l'image
  created_at: string;
  updated_at: string;
  supplements: string[];
  quantiteDisponible: number;
  date_creation: string;
  date_modification: string;
  note_moyenne?: number; // Note moyenne du plat
  temps_preparation?: number; // Temps de préparation en minutes
  // Propriétés pour la compatibilité
  type?: string;
  nom?: string | ReactNode;
}

export interface Reservation {
  id: number;
  etudiant: User;
  plat: Plat;
  date_reservation: string;
  date: string;
  creneau: string;
  statut: "en_attente" | "accepte" | "refuse" | "annule";
  date_creation: string;
  date_modification: string;
  emploi_du_temps: {
    id: number;
    creneau: string;
    [key: string]: any;
  };
  supplements?: Array<{
    id: number;
    nom: string;
    prix: number;
    [key: string]: any;
  }>;
  quantite: number;
  [key: string]: any; // Pour les propriétés supplémentaires
}

export interface Avis {
  id: number;
  etudiant: User;
  plat: Plat;
  note: number;
  commentaire: string;
  approuve: boolean;
  date_creation: string;
  date_modification: string;
}

export interface Supplement {
  nom: string;
  prix: number;
}

export interface ReservationRequest {
  plat_id: number;
  emploi_du_temps_id: number;
  quantite: number;
  supplements: Supplement[];
  date: string;
  creneau: string;
}

export interface Notification {
  date_envoi: string;
  est_lue: boolean;
  id: number;
  message: string;
  read: boolean;
  titre: string;
  lien: string;
  destinataire: number;
  contenu: string;
}

export interface EmploiDuTemps {
  date: string | number | Date;
  id: number;
  plat_id: number;
  plat: Plat;
  creneau: number;
  jour: string;
  heure_debut: string;
  heure_fin: string;
  quantite_disponible: number;
}

export interface Parametre {
  heure_limite_reservation: string;
  nombre_max_reservations: number;
  delai_annulation: number;
  message_accueil: string;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Types pour les formulaires
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  institut: string;
}

export interface ReservationFormData {
  plat_id: number;
  date: string;
}

export interface AvisFormData {
  plat_id: number;
  note: number;
  commentaire: string;
}

export interface NotificationRequest {
  destinataire: number;
  titre: string;
  contenu: string;
  lien?: string;
}

export interface ReservationRequest {
  plat_id: number;
  date: string;
  creneau: string;
}

export interface PlatRequest {
  id: number;
  nom: string;
  description: string;
  prix: number;
  type: string;
  quantiteDisponible: number;
}