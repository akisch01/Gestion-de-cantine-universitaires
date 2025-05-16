import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ROUTES } from "../../assets/config/routes";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Header />
      <div className="flex flex-1 pt-16 md:pt-20 relative">
        <Sidebar />
        {/* Conteneur principal avec marge pour la sidebar */}
        <div className={`flex-1 transition-all duration-300 ${
          // Ajoute la marge uniquement sur les grands écrans
          'md:ml-64'
        }`}>
          <main className="w-full min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] p-4 sm:p-6">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};