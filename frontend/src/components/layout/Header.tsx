import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider";
import { NotificationBell } from "../shared/NotificationBell";

export const Header = () => {
    const { user, logout, isStaff } = useAuth();

    return (
        <header className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-40 shadow-sm w-full">
            <nav className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4">
                <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
                    <Link to="/" className="flex items-center space-x-3 sm:space-x-4 md:space-x-5 flex-shrink-0">
                        <div className="relative">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
                                <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold">CU</span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="block">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent whitespace-nowrap">
                                Cantine Universitaire
                            </h1>
                            <p className="text-xs sm:text-sm md:text-base text-gray-500 whitespace-nowrap">Plateforme de gestion des repas</p>
                        </div>
                    </Link>

                    {/* Bouton de notification et profil sur mobile */}
                    <div className="md:hidden flex items-center space-x-2">
                        <NotificationBell />
                        <Link 
                            to="/profil" 
                            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300"
                            aria-label="Profil"
                        >
                            {user ? (user.first_name?.[0] || '') + (user.last_name?.[0] || '') : '👤'}
                        </Link>
                    </div>

                    {/* Navigation desktop */}
                    <div className="hidden md:flex items-center space-x-2 md:space-x-4 lg:space-x-6">
                        <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-6">
                            {isStaff ? (
                                <>
                                    <Link to="/admin/dashboard" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium text-sm md:text-base">
                                        <span>📊</span>
                                        <span className="whitespace-nowrap">Tableau de bord</span>
                                    </Link>
                                    <Link to="/admin/plats" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium text-sm md:text-base">
                                        <span>🍳</span>
                                        <span className="whitespace-nowrap">Gestion des plats</span>
                                    </Link>
                                    <Link to="/admin/emploi-du-temps" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium text-sm md:text-base">
                                        <span>📅</span>
                                        <span className="whitespace-nowrap">Emploi du temps</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/menu" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium text-base md:text-lg">
                                        <span className="text-lg">🍽️</span>
                                        <span className="whitespace-nowrap">Menu</span>
                                    </Link>
                                    <Link to="/reservation" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium text-base md:text-lg">
                                        <span className="text-lg">📅</span>
                                        <span className="whitespace-nowrap">Réservation</span>
                                    </Link>
                                    <Link to="/historique" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium text-base md:text-lg">
                                        <span className="text-lg">📋</span>
                                        <span className="whitespace-nowrap">Historique</span>
                                    </Link>
                                </>
                            )}
                        </div>
                        <NotificationBell />
                        {user ? (
                            <div className="flex items-center space-x-2 sm:space-x-3 ml-2">
                                <div className="hidden sm:block text-right">
                                    <p className="font-semibold text-gray-900 text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] md:max-w-[150px]">
                                        {user.first_name} {user.last_name}
                                    </p>
                                    {user.institut && (
                                        <p className="text-xs md:text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] md:max-w-[150px]">
                                            {user.institut}
                                        </p>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-medium shadow-lg cursor-pointer text-sm sm:text-base">
                                        {user.first_name?.[0] || ''}{user.last_name?.[0] || ''}
                                    </div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 hidden group-hover:block z-50">
                                        <Link to="/profil" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                                            <span className="flex items-center space-x-2">
                                                <span>👤</span>
                                                <span>Profil</span>
                                            </span>
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                                        >
                                            <span className="flex items-center space-x-2">
                                                <span>🚪</span>
                                                <span>Déconnexion</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};