import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatCard } from './PlatCard';
import { MenuFilters } from './Filters';
import { EmploiDuTemps, Plat } from '../../../types/models';
import { emploiDuTempsApi } from '../../../api/emploiDuTemps';
import { useAuth } from '../../../features/auth/AuthProvider';

const joursSemaine: Record<string, string> = {
  'lundi': 'Lundi',
  'mardi': 'Mardi',
  'mercredi': 'Mercredi',
  'jeudi': 'Jeudi',
  'vendredi': 'Vendredi'
};

const creneauxHoraires = {
  'matin': 'Matin',
  'midi': 'Midi',
  'soir': 'Soir'
};

export const MenuView: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [emploiDuTemps, setEmploiDuTemps] = useState<EmploiDuTemps[]>([]);
  
  // Gestion du clic sur la carte
  const handleCardClick = (e: React.MouseEvent, plat: Plat) => {
    e.stopPropagation();
    handleReservation(plat);
  };
  
  // Structure pour stocker les plats organisés par jour et par créneau
  interface CreneauOrganise {
    creneau: string;
    nomCreneau: string;
    plats: EmploiDuTemps[];
  }

  interface JourOrganise {
    jour: string;
    nomJour: string;
    creneaux: CreneauOrganise[];
  }

  const [platsOrganises, setPlatsOrganises] = useState<JourOrganise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type JourSemaine = 'all' | 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi';
  
  interface Filters {
    search: string;
    jour: JourSemaine;
  }
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
    jour: 'all' as JourSemaine
  });

  const handleReservation = (_plat: Plat) => {
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      navigate('/login', { state: { from: '/menu' } });
      return;
    }

    // Logique de réservation ici
    //console.log('Réservation du plat :', plat.nom_plat);
    // Vous pouvez ajouter une logique pour ouvrir un modal de confirmation
    // ou effectuer directement la réservation via une API
  };

  useEffect(() => {
    // Filtrer d'abord les emplois selon les critères
    const filteredEmplois = emploiDuTemps.filter(emploi => {
      if (!emploi?.plat) return false;
      
      const plat = emploi.plat;
      const searchTerm = filters.search.toLowerCase();
      const platNom = plat.nom_plat || '';
      const jour = emploi.jour || '';
      
      const matchesSearch = platNom.toLowerCase().includes(searchTerm);
      const matchesDay = filters.jour === 'all' || 
        jour.toLowerCase() === filters.jour.toLowerCase();
      
      return matchesSearch && matchesDay;
    });

    // Organiser les plats par jour et créneau
    const organiserPlats = (emplois: EmploiDuTemps[]) => {
      // Créer un objet pour regrouper par jour et par créneau
      const groupes: Record<string, Record<string, EmploiDuTemps[]>> = {};

      // Remplir les groupes
      emplois.forEach((emploi) => {
        if (!emploi?.id) return;
        
        const jour = emploi.jour || 'Non défini';
        const creneau = emploi.creneau?.toString() || 'Non défini';

        if (!groupes[jour]) {
          groupes[jour] = {};
        }
        if (!groupes[jour][creneau]) {
          groupes[jour][creneau] = [];
        }

        groupes[jour][creneau].push(emploi);
      });

      // Convertir en tableau pour le rendu
      const result: JourOrganise[] = [];
      
      for (const [jour, creneauxParJour] of Object.entries(groupes)) {
        // Convertir le jour en nom de jour en français
        const nomJour = joursSemaine[jour as keyof typeof joursSemaine] || jour;
        const creneaux: CreneauOrganise[] = [];
        
        for (const creneau in creneauxParJour) {
          if (creneauxParJour.hasOwnProperty(creneau)) {
            const plats = creneauxParJour[creneau];
            creneaux.push({
              creneau,
              nomCreneau: creneauxHoraires[creneau as keyof typeof creneauxHoraires] || creneau,
              plats,
            });
          }
        }
        
        result.push({
          jour,
          nomJour,
          creneaux,
        });
      }

      // Trier les jours selon l'ordre de la semaine
      result.sort((a, b) => {
        const jours = Object.keys(joursSemaine);
        return jours.indexOf(a.jour) - jours.indexOf(b.jour);
      });

      return result;
    };

    if (filteredEmplois.length > 0) {
      setPlatsOrganises(organiserPlats(filteredEmplois));
    } else {
      setPlatsOrganises([]);
    }
  }, [emploiDuTemps, filters]);

  // Gestion du chargement initial des données
  useEffect(() => {
    if (isAuthenticated) {
      fetchEmploiDuTemps();
    }
  }, [isAuthenticated]);
  
  // Gestion des changements de filtre
  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const fetchEmploiDuTemps = async () => {
    try {
      const data = await emploiDuTempsApi.getAll();

      setEmploiDuTemps(data);
    } catch (err) {
      setError("Erreur lors du chargement des plats programmés");
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Notre Menu <span className="text-blue-600">Quotidien</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection de plats préparés avec soin par nos chefs.
            </p>
          </div>
          
          {/* Filtres */}
          <div className="mb-6 sm:mb-8">
            <MenuFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">

            {/* Liste des plats par jour */}
            <div className="space-y-6">
          {platsOrganises.length > 0 ? (
            platsOrganises.map(({ jour, nomJour, creneaux }) => (
              <div key={jour} className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 border border-gray-100">
                <div className="bg-blue-600 px-4 py-3 sm:px-6">
                  <h2 className="text-xl font-bold text-white">
                    {nomJour}
                  </h2>
                </div>
                
                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['midi', 'soir'].map((creneauType) => {
                      const creneau = creneaux.find(c => c.creneau === creneauType);
                      if (!creneau || creneau.plats.length === 0) return null;
                      
                      return (
                        <div key={`${jour}-${creneau.creneau}`} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div className="flex items-center mb-3">
                            <div className="h-1 w-6 bg-blue-500 rounded-full mr-2"></div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {creneau.nomCreneau}
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {creneau.plats.map((emploi) => (
                              <div 
                                key={emploi.id} 
                                className="cursor-pointer"
                                onClick={(e) => handleCardClick(e, emploi.plat)}
                              >
                                <PlatCard 
                                  plat={emploi.plat}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="max-w-md mx-auto px-4">
                <svg
                  className="mx-auto h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="mt-3 text-lg font-medium text-gray-800">Aucun plat programmé</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Aucun plat n'est actuellement programmé pour cette période.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Actualiser
                  </button>
                </div>
              </div>
            </div>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};