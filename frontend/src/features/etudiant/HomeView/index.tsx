import React, { useState, useEffect } from 'react';
import HomePlatCard from './PlatCard';
import { HomeFilters } from './Filters';
import { Plat } from '@/types/models';
import { platsApi } from '@/api/plats';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiRotateCw, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Composant de chargement
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-5">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded w-5/6"></div>
          <div className="mt-6 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);

export const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const [plats, setPlats] = useState<Plat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mappage entre les valeurs de type_plat et leurs libellés d'affichage
  const platTypes = [
    { value: 'all', label: 'Tous les types', color: 'from-gray-500 to-gray-600' },
    { value: 'standard', label: 'Standard', color: 'from-blue-500 to-blue-600' },
    { value: 'vip', label: 'VIP', color: 'from-purple-500 to-pink-600' },
    { value: 'vegetarien', label: 'Végétarien', color: 'from-green-500 to-emerald-600' },
    { value: 'sans_gluten', label: 'Sans Gluten', color: 'from-amber-500 to-orange-500' }
  ];

  useEffect(() => {
    fetchPlats();
  }, []);

  const fetchPlats = async () => {
    try {
      const data = await platsApi.getAll();
      setPlats(data);
    } catch (err) {
      console.error('Erreur lors du chargement des plats:', err);
      setError("Erreur lors du chargement des plats. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPlats = plats.filter(plat => {
    // Filtrage par type
    if (filters.type !== 'all' && plat.type_plat !== filters.type) {
      return false;
    }
    // Filtrage par recherche
    if (filters.search && !plat.nom_plat.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleReservationSuccess = () => {
    // Rafraîchir la liste des plats après une réservation réussie
    fetchPlats();
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
              <div className="mt-4">
                <button
                  onClick={fetchPlats}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FiRotateCw className="mr-2 h-4 w-4" />
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (filteredPlats.length === 0) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-4"
        >
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 dark:bg-blue-900/30 mb-4">
            <FiSearch className="h-12 w-12 text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun résultat trouvé</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Aucun plat ne correspond à votre recherche. Essayez d'autres termes ou réinitialisez les filtres.
          </p>
          <button 
            onClick={() => setFilters({ type: 'all', search: '' })}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiFilter className="mr-2 h-4 w-4" />
            Réinitialiser les filtres
          </button>
        </motion.div>
      );
    }

    return (
      <div className="w-full">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 justify-items-center px-2 sm:px-0"
        >
          {filteredPlats.map((plat, index) => (
            <motion.div
              key={plat.id}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.4,
                    ease: [0.2, 0.65, 0.3, 0.9]
                  }
                }
              }}
              className="w-full max-w-xs sm:max-w-none"
            >
              <HomePlatCard
                plat={plat}
                onReserve={handleReservationSuccess}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  };

  // Tags populaires
  const popularTags = [
    { name: 'Plats du jour', emoji: '🍽️', count: 12 },
    { name: 'Les mieux notés', emoji: '⭐', count: 8 },
    { name: 'Options saines', emoji: '🥗', count: 5 },
    { name: 'Nouveautés', emoji: '🆕', count: 3 },
  ];

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Découvrez les délices de la <span className="text-blue-600">cantine universitaire</span>
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Réservez vos repas préférés en quelques clics et profitez d'une expérience culinaire exceptionnelle
              </p>
              
              {/* Barre de recherche mobile */}
              <div className="mt-6 max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un plat..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Tags populaires */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {popularTags.map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => setFilters({ ...filters, search: tag.name })}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors whitespace-nowrap"
                  >
                    <span className="mr-1.5">{tag.emoji}</span>
                    <span>{tag.name}</span>
                    <span className="ml-1.5 px-1.5 py-0.5 bg-blue-100 rounded-full text-xs">
                      {tag.count}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Contenu principal */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mt-8">
            {/* En-tête de section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl font-semibold text-gray-800">Notre sélection</h2>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  {filteredPlats.length} {filteredPlats.length !== 1 ? 'plats disponibles' : 'plat disponible'}
                </p>
              </div>
              
              {/* Filtres de bureau */}
              <div className="w-full sm:w-auto">
                <div className="flex flex-col xs:flex-row xs:items-center space-y-3 xs:space-y-0 xs:space-x-3">
                  <div className="relative w-full xs:w-auto xs:flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher un plat..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  
                  <div className="relative w-full xs:w-auto">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="w-full xs:w-auto inline-flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiFilter className="mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4" />
                      <span>Filtres</span>
                    </button>
                    
                    {/* Menu déroulant des filtres */}
                    {showFilters && (
                      <div className="absolute right-0 mt-2 w-48 sm:w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <div className="px-3 sm:px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                            Type de plat
                          </div>
                          {platTypes.map((type) => (
                            <button
                              key={type.value}
                              onClick={() => {
                                setFilters({ ...filters, type: type.value });
                                setShowFilters(false);
                              }}
                              className={`w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm ${filters.type === type.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              role="menuitem"
                            >
                              <div className="flex items-center">
                                <span className={`inline-block w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r ${type.color} mr-2`}></span>
                                {type.label}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="px-1 sm:px-0">
              {renderContent()}
            </div>
            
            {/* Bouton de retour en haut */}
            <div className="mt-8 sm:mt-12 text-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm sm:text-base font-medium rounded-full shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Retour en haut
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
