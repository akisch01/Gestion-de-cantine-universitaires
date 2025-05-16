import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { User, LoginFormData, RegisterFormData } from "../types/models";
import { useNotification } from "./useNotification";
import { JWT_STORAGE_KEY } from "../lib/constants";
import { ROUTES, DEFAULT_ROUTES } from "../assets/config/routes";

const USER_ROLE_KEY = 'role';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem(JWT_STORAGE_KEY);
      if (!token) {
        setUser(null);
        return;
      }

      const userData = await authApi.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
      localStorage.removeItem(JWT_STORAGE_KEY);
      localStorage.removeItem(USER_ROLE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (data: LoginFormData) => {
    try {
      const response = await authApi.login(data);
      const { access: token, user: userData } = response;
      localStorage.setItem(JWT_STORAGE_KEY, token);
      // Le rôle est déjà stocké dans userData.role
      setUser(userData);

      // Redirection selon le rôle
      const defaultRoute = userData.is_staff 
        ? DEFAULT_ROUTES.ADMIN 
        : DEFAULT_ROUTES.STUDENT;
      navigate(defaultRoute);

      showNotification("Connexion réussie", "success");
    } catch (error) {
      showNotification("Erreur lors de la connexion", "error");
      throw error;
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      await authApi.register(data);
      showNotification("Inscription réussie", "success");
      navigate(ROUTES.LOGIN);
    } catch (error) {
      showNotification("Erreur lors de l'inscription", "error");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem(JWT_STORAGE_KEY);
      localStorage.removeItem(USER_ROLE_KEY);
      setUser(null);
      navigate(ROUTES.LOGIN);
      showNotification("Déconnexion réussie", "success");
    } catch (error) {
      showNotification("Erreur lors de la déconnexion", "error");
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const updatedUser = await authApi.updateUser(data);
      setUser(updatedUser);
      showNotification("Profil mis à jour avec succès", "success");
    } catch (error) {
      showNotification("Erreur lors de la mise à jour du profil", "error");
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "etudiant";

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isStudent,
    login,
    register,
    logout,
    updateUser,
  };
};