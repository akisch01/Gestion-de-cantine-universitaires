import React, { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

interface PlatType {
  value: string;
  label: string;
}

interface HomeFiltersProps {
  types: PlatType[] | string[];
  selectedType: string;
  onTypeChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const HomeFilters: React.FC<HomeFiltersProps> = ({
  types = [],
  selectedType,
  onTypeChange,
  searchQuery,
  onSearchChange,
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Normaliser les types en tableau d'objets {value, label}
  const normalizedTypes = useMemo(() => {
    return types.map(type => {
      if (typeof type === 'string') {
        return { value: type, label: type };
      }
      return type;
    });
  }, [types]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const clearFilters = () => {
    onTypeChange('all');
    onSearchChange('');
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(e.target.value);
  };

  return (
    <div className="w-full">
      {/* Barre de recherche pour mobile */}
      <div className="md:hidden mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Rechercher un plat..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-500"
          >
            <FiFilter size={20} />
          </button>
        </div>
      </div>

      {/* Filtres pour mobile */}
      {isMobileFiltersOpen && (
        <div className="md:hidden mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Filtres</h3>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type de plat
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                >
                  {normalizedTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}

      {/* Filtres pour desktop */}
      <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative flex-1 w-full max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un plat..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Type :
          </span>
          <div className="flex flex-wrap gap-2">
            {normalizedTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => onTypeChange(type.value)}
                className={`px-3 py-1 text-sm rounded-full ${
                  selectedType === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="ml-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};
