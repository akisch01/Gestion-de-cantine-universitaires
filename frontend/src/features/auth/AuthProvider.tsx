import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../api/client";
import { User, RegisterFormData } from "../../types/models";

const JWT_STORAGE_KEY = "token";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isStaff: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    // Initialisation de l'état
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    if (token) {
      // Utiliser l'endpoint correct avec le serializer
      apiClient.get<User>('/auth/me/').then(response => {
        const userData = response.data;
        // Convertir is_staff en boolean en gérant les différents types possibles
        const isStaffValue = Boolean(userData.is_staff);
        setUser(userData);
        setIsStaff(isStaffValue);
        setIsLoading(false);
      }).catch(() => {
        // Ne pas supprimer le token immédiatement, il pourrait s'agir d'une erreur temporaire
        // Le token sera supprimé automatiquement par l'intercepteur en cas d'erreur 401
        setUser(null);
        setIsStaff(false);
        setIsLoading(false);
      });
    } else {
      setUser(null);
      setIsStaff(false);
      setIsLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    // Mise à jour de l'état
  }, [user, isStaff, isLoading]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/token/obtain/", { 
        username: email,
        password 
      });
      
      const { access: token, user: userData } = response.data;
      localStorage.setItem(JWT_STORAGE_KEY, token);
      
      // Vérifier si l'utilisateur est admin (uniquement par is_staff)
      const isStaffValue = userData.is_staff === true;
      
      setUser(userData);
      setIsStaff(isStaffValue);
      setIsLoading(false);

      // Redirection automatique en fonction du statut is_staff
      if (isStaffValue) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error('Auth - Erreur lors de l\'authentification:', error);
      throw error;
    }
  };

  const register = async (data: RegisterFormData) => {
    await apiClient.post("/auth/register/", data);
  };

  const logout = () => {
    localStorage.removeItem(JWT_STORAGE_KEY);
    localStorage.removeItem('is_staff');
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isStaff,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};