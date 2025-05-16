import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { LoginForm } from "./features/auth/LoginForm";
import { RegisterForm } from "./features/auth/RegisterForm";
import { MenuView } from "./features/etudiant/MenuView";
import { ReservationPage } from "./features/etudiant/Reservation/ReservationPage";
import { Timeline } from "./features/etudiant/Historique/Timeline";
import { StatsCards } from "./features/admin/Dashboard/StatsCards";
import { PlatForm } from "./features/admin/GestionPlats/PlatForm";
import { UserTable } from "./features/admin/GestionUtilisateurs/UserTable";
import { EmploiDuTempsForm } from "./features/admin/GestionEmploiDuTemps/EmploiDuTempsForm";
import { ParametresForm } from "./features/admin/GestionParametres/ParametresForm";
import { AvisTable } from "./features/admin/GestionAvis/AvisTable";
import { HomeView } from "./features/etudiant/HomeView";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { ProfileManager } from "./features/common/ProfileManager";
import { NotificationCenter } from "./features/common/NotificationCenter";
import { NotFound } from "./components/shared/NotFound";
import { NotificationToast } from './components/shared/NotificationToast';
import { ROUTES } from "./assets/config/routes";

const App: React.FC = () => {
  return (
    <>
      <NotificationToast />
      <AppShell>
        <Routes>
          {/* Auth */}
          <Route path={ROUTES.LOGIN} element={<LoginForm />} />
          <Route path={ROUTES.REGISTER} element={<RegisterForm />} />

          {/* Page d'accueil */}
          <Route path={ROUTES.HOME} element={<HomeView />} />
            
          <Route
            path={ROUTES.STUDENT.MENU}
            element={
              <ProtectedRoute adminOnly={false}>
                <MenuView />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT.RESERVATION}
            element={
              <ProtectedRoute adminOnly={false}>
                <ReservationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT.HISTORY}
            element={
              <ProtectedRoute adminOnly={false}>
                <Timeline />
              </ProtectedRoute>
            }
          />

          {/* Espace admin */}
          <Route
            path={ROUTES.ADMIN.DASHBOARD}
            element={
              <ProtectedRoute adminOnly={true}>
                <StatsCards />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.PLATS}
            element={
              <ProtectedRoute adminOnly={true}>
                <PlatForm />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.EMPLOI_DU_TEMPS}
            element={
              <ProtectedRoute adminOnly={true}>
                <EmploiDuTempsForm />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.PARAMETRES}
            element={
              <ProtectedRoute adminOnly={true}>
                <ParametresForm />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.AVIS}
            element={
              <ProtectedRoute adminOnly={true}>
                <AvisTable />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN.USERS}
            element={
              <ProtectedRoute adminOnly={true}>
                <UserTable />
              </ProtectedRoute>
            }
          />

          {/* Commun */}
          <Route
            path={ROUTES.STUDENT.PROFILE}
            element={
              <ProtectedRoute>
                <ProfileManager />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT.NOTIFICATIONS}
            element={
              <ProtectedRoute>
                <NotificationCenter />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </>
  );
};

export default App;