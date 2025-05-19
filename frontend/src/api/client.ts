import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://gestion-cantine-backend.onrender.com/api';

// Fonction utilitaire pour vérifier et nettoyer le token
const cleanToken = (token: string | null): string | null => {
  if (!token) return null;
  
  // Si le token commence par "{" ou "[", c'est probablement un objet JSON mal formé
  if (token.startsWith('{') || token.startsWith('[')) {
    try {
      const tokenObj = JSON.parse(token);
      // Si c'est un objet avec un champ access, utiliser ce champ
      if (tokenObj.access) {
        return tokenObj.access;
      }
      // Si c'est un objet avec un champ token, utiliser ce champ
      if (tokenObj.token) {
        return tokenObj.token;
      }
      // Sinon, retourner null car le format est inconnu
      return null;
    } catch (e) {
      // Si le JSON est invalide, c'est probablement déjà un JWT
      return token;
    }
  }
  
  // Si le token commence par "eyJ", c'est probablement un JWT valide
  if (token.startsWith('eyJ')) {
    return token;
  }
  
  // Sinon, retourner null car le format est inconnu
  return null;
};

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = client;
export const axiosInstance = client;


// Intercepteur pour gérer le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    // Vérifier si le token existe dans le localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Nettoyer le token
      const cleanTokenValue = cleanToken(token);
      if (cleanTokenValue) {
        // Utiliser le token nettoyé
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${cleanTokenValue}`
        } as any; // Forcer le type pour bypasser l'erreur TypeScript
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion si le token est invalide
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 
