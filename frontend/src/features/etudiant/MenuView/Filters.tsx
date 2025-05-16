import React, { useState } from 'react';

type JourSemaine = 'all' | 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi';

interface MenuFiltersProps {
  filters: {
    search: string;
    jour: JourSemaine;
  };
  onFilterChange: (filters: {
    search: string;
    jour: JourSemaine;
  }) => void;
}

export const MenuFilters: React.FC<MenuFiltersProps> = ({ filters, onFilterChange }) => {
  const [search, setSearch] = useState(filters.search);
  const [selectedJour, setSelectedJour] = useState(filters.jour);

  const handleJourChange = (jour: string) => {
    // Vérifier que la valeur est bien un JourSemaine valide
    const selectedJour = (['all', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'].includes(jour) 
      ? jour 
      : 'all') as JourSemaine;
      
    setSelectedJour(selectedJour);
    onFilterChange({ ...filters, jour: selectedJour });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onFilterChange({ ...filters, search: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 w-full mb-6 transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Champ de recherche */}
        <div className="w-full">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rechercher un plat
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Nom du plat..."
              value={search}
              onChange={handleSearchChange}
              className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sélecteur de jour */}
        <div className="w-full">
          <label htmlFor="jour" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Jour de la semaine
          </label>
          <select
            id="jour"
            value={selectedJour}
            onChange={(e) => handleJourChange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les jours</option>
            <option value="lundi">Lundi</option>
            <option value="mardi">Mardi</option>
            <option value="mercredi">Mercredi</option>
            <option value="jeudi">Jeudi</option>
            <option value="vendredi">Vendredi</option>
          </select>
        </div>
      </div>
      
      {/* Boutons de filtre rapide */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => handleJourChange('all')}
          className={`px-3 py-1 text-xs sm:text-sm rounded-full ${
            selectedJour === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Tous
        </button>
        {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'].map((jour) => (
          <button
            key={jour}
            onClick={() => handleJourChange(jour)}
            className={`px-3 py-1 text-xs sm:text-sm rounded-full ${
              selectedJour === jour
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {jour.charAt(0).toUpperCase() + jour.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};