import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import { ROUTES } from "../../assets/config/routes";
import { FiMenu, FiX } from "react-icons/fi";

export const Sidebar: React.FC = () => {
  const { isStaff } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fermer le menu mobile lors du redimensionnement de l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const studentLinks = [
    { to: ROUTES.STUDENT.MENU, label: "Menu", icon: "🍽️" },
    { to: ROUTES.STUDENT.RESERVATION, label: "Réservation", icon: "📅" },
    { to: ROUTES.STUDENT.HISTORY, label: "Historique", icon: "📋" },
    { to: ROUTES.STUDENT.NOTIFICATIONS, label: "Notifications", icon: "🔔" },
    { to: ROUTES.STUDENT.PROFILE, label: "Profil", icon: "👤" },
  ];

  const adminLinks = [
    { to: ROUTES.ADMIN.DASHBOARD, label: "Tableau de bord", icon: "📊" },
    { to: ROUTES.ADMIN.PLATS, label: "Gestion des plats", icon: "🍳" },
    { to: ROUTES.ADMIN.EMPLOI_DU_TEMPS, label: "Emploi du temps", icon: "📅" },
    { to: ROUTES.ADMIN.PARAMETRES, label: "Paramètres", icon: "⚙️" },
    { to: ROUTES.ADMIN.AVIS, label: "Gestion des avis", icon: "⭐" },
    { to: ROUTES.ADMIN.USERS, label: "Utilisateurs", icon: "👥" },
    { to: ROUTES.ADMIN.PROFILE, label: "Profil", icon: "👤" },
  ];

  const links = isStaff ? adminLinks : studentLinks;

  return (
    <>
      {/* Bouton du menu mobile */}
      <button 
        onClick={toggleMobileMenu}
        className={`fixed bottom-6 left-4 md:hidden z-50 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center border-2 border-white dark:border-gray-800 transition-transform duration-200 ${
          isMobileMenuOpen ? 'transform rotate-90' : ''
        }`}
        aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay pour mobile */}
      <div 
        className={`fixed inset-0 z-30 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileMenu}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      
      {/* Sidebar */}
      <div 
        className={`fixed top-20 md:top-24 left-0 h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)] bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } w-72 z-40 overflow-y-auto`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#9CA3AF #F3F4F6'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Menu</h2>
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Fermer le menu"
            >
              <FiX className="w-7 h-7 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          
          <nav className="py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-4 px-5 py-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-lg ${
                    isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : ''
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                <span className="text-2xl">{link.icon}</span>
                <span className="text-base font-medium">{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};