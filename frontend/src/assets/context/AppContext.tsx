import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { User } from "../../types/models";

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const checkAuth = async () => {
      try {
        // Implémentez votre logique de vérification d'authentification ici
        setIsLoading(false);
      } catch (_err) {
        setError("Erreur lors de la vérification de l'authentification");
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};