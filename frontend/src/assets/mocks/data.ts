// Données de test pour l'application

import { User, Plat, Reservation, Notification } from "../../types/models";

// Utilisateurs de test
export const MOCK_USERS: User[] = [
  {
    id: 1,
    email: "etudiant@example.com",
    username: "etudiant1",
    first_name: "Jean",
    last_name: "Dupont",
    institut: "Université de Paris",
    is_staff: false,
    date_inscription: "2023-01-01T00:00:00Z",
    last_login: "2023-01-01T00:00:00Z",
    date_joined: "2023-01-01T00:00:00Z",
    role: "etudiant",
    is_active: true,
    is_superuser: false,
    groups: [],
    user_permissions: []
  },
  {
    id: 2,
    email: "admin@example.com",
    username: "admin1",
    first_name: "Sophie",
    last_name: "Martin",
    institut: "Université de Paris",
    is_staff: true,
    date_inscription: "2023-01-01T00:00:00Z",
    last_login: "2023-01-01T00:00:00Z",
    date_joined: "2023-01-01T00:00:00Z",
    role: "admin",
    is_active: true,
    is_superuser: true,
    groups: [],
    user_permissions: []
  }
];

// Plats de test
export const MOCK_PLATS: Plat[] = [
  {
    id: 1,
    nom_plat: "Poulet rôti",
    prix: 8.50,
    type_plat: "standard",
    description: "Poulet rôti avec pommes de terre et légumes",
    image: "/images/poulet-roti.jpg",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: 2,
    nom_plat: "Salade composée",
    prix: 7.00,
    type_plat: "vegetarien",
    description: "Salade avec quinoa, avocat et tomates",
    image: "/images/salade-composee.jpg",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  }
];

// Réservations de test
export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 1,
    etudiant: 1,
    plat: 1,
    emploi_du_temps: 1,
    quantite: 1,
    supplements: {},
    total_prix: 8.50,
    date_reservation: "2023-01-01T12:00:00Z",
    statut: "accepte",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: 2,
    etudiant: 1,
    plat: 2,
    emploi_du_temps: 2,
    quantite: 1,
    supplements: {},
    total_prix: 7.00,
    date_reservation: "2023-01-02T12:00:00Z",
    statut: "en_attente",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  }
];

// Notifications de test
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    destinataire: 1,
    titre: "Réservation confirmée",
    contenu: "Votre réservation pour le plat 'Poulet rôti' a été confirmée",
    date_envoi: "2023-01-01T00:00:00Z",
    est_lue: false,
    lien: "/reservations/1"
  },
  {
    id: 2,
    destinataire: 1,
    titre: "Nouveau plat disponible",
    contenu: "Un nouveau plat 'Salade composée' est disponible",
    date_envoi: "2023-01-01T00:00:00Z",
    est_lue: false,
    lien: "/plats/2"
  }
];