import axios from "axios";
import { API_URL, JWT_STORAGE_KEY } from "./constants";
import { refreshToken } from "../api/auth"; // Importer la fonction de rafraîchissement du token

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Ajout automatique du token JWT à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    if (token) {
      const cleanTokenValue = cleanToken(token);
      if (cleanTokenValue) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${cleanTokenValue}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gestion globale des erreurs (ex: déconnexion si 401)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Log de l'erreur pour le débogage
      console.error("Erreur API:", error.response);

      // Gestion spécifique des erreurs 401
      if (error.response.status === 401) {
        const isAuthEndpoint = error.config.url?.includes("auth");
        if (!isAuthEndpoint) {
          try {
            // Tenter de rafraîchir le token
            const newToken = await refreshToken();
            if (newToken) {
              localStorage.setItem(JWT_STORAGE_KEY, JSON.stringify(newToken));
              error.config.headers.Authorization = `Bearer ${cleanToken(newToken.access)}`;
              return apiClient.request(error.config); // Réessayer la requête originale
            }
          } catch (refreshError) {
            console.error("Échec du rafraîchissement du token:", refreshError);
          }
        }

        // Suppression du jeton et redirection si le rafraîchissement échoue
        localStorage.removeItem(JWT_STORAGE_KEY);
        localStorage.removeItem("cantine_refresh_token"); // Supprimer le token de rafraîchissement
        window.location.href = "/login"; // Rediriger vers la page de connexion
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

export const cleanToken = (token: string | null): string | null => {
  if (!token) return null;
  
  // Si le token commence par "eyJ", c'est un JWT valide
  if (token.startsWith('eyJ')) {
    return token;
  }
  
  // Sinon, essayons de le parser comme JSON
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
  } catch {
    // Si le JSON est invalide, c'est probablement déjà un JWT
    return token;
  }
}
