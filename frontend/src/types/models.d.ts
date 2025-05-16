// Types globaux de l'application

export interface User {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    institut: string;
    is_staff: boolean;
    role: 'etudiant' | 'admin';
    date_inscription: string;
    last_login: string;
    date_joined: string;
    is_active: boolean;
    is_superuser: boolean;
    groups: number[];
    user_permissions: number[];
}

export interface Plat {
    id: number;
    nom_plat: string;
    prix: number;
    type_plat: 'standard' | 'vip' | 'vegetarien' | 'sans_gluten';
    description: string;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface Reservation {
    id: number;
    etudiant: number;
    plat: number;
    emploi_du_temps: number;
    quantite: number;
    supplements: Record<string, any>;
    total_prix: number;
    date_reservation: string;
    statut: 'en_attente' | 'accepte' | 'refuse' | 'expire';
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: number;
    destinataire: number;
    titre: string;
    contenu: string;
    date_envoi: string;
    est_lue: boolean;
    lien: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}

// Types de requête
export interface PlatRequest {
    nom_plat: string;
    description: string;
    prix: number;
    type_plat: 'standard' | 'vip' | 'vegetarien' | 'sans_gluten';
    image: string;
}

export interface AvisRequest {
    plat_id: number;
    note: number;
    commentaire?: string;
    reservation_id: number;
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

export interface Avis {
    id: number;
    etudiant: number;
    plat: number;
    note: number;
    commentaire?: string;
    date_publication: string;
    est_approuve: boolean;
    reservation_id: number;
}