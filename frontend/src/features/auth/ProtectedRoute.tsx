import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ROUTES } from '../../assets/config/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean; // Indique si la route est réservée aux admins
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  // Vérification pour les pages admin
  if (adminOnly && !user.is_staff) {
    return <Navigate to={ROUTES.HOME} />; // Redirige les non-admins vers la page d'accueil
  }

  // Vérification pour les pages étudiant
  if (!adminOnly && user.is_staff) {
    return <Navigate to={ROUTES.ADMIN.DASHBOARD} />; // Redirige les admins vers le tableau de bord admin
  }

  return <>{children}</>;
};