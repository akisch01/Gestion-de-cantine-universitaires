import React, { useState, useEffect } from "react";
import { platsApi } from "../../../api/plats";
import { emploiDuTempsApi } from "../../../api/emploiDuTemps";
import { useReservation } from "../../../hooks/useReservation";
import { useNotification } from "../../../hooks/useNotification";
import { Plat, EmploiDuTemps } from "../../../types/models";
import { RecapModal } from "./RecapModal";
import "./styles.css";

export const ImprovedWizardSteps = () => {
  const [step, setStep] = useState(1);
  const [selectedPlat, setSelectedPlat] = useState<(Plat & { creneaux: EmploiDuTemps[] }) | null>(null);
  const [emploiDuTempsList, setEmploiDuTempsList] = useState<EmploiDuTemps[]>([]);
  const [selectedEmploiDuTemps, setSelectedEmploiDuTemps] = useState<EmploiDuTemps | null>(null);
  const [quantite, setQuantite] = useState(1);
  const [plats, setPlats] = useState<(Plat & { creneaux: EmploiDuTemps[] })[]>([]);
  const [showRecap, setShowRecap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [supplementsSelectionnes, setSupplementsSelectionnes] = useState<string[]>([]);
  const [prixTotal, setPrixTotal] = useState<string>('0 FCFA');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createReservation } = useReservation();
  const { showNotification } = useNotification();

  // Formatage du prix
  const formatPrix = (prix: number | string | undefined): string => {
    if (prix === undefined || prix === null) return '0 FCFA';
    const nombre = typeof prix === 'string' ? parseFloat(prix) : prix;
    if (isNaN(nombre)) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR', { 
      style: 'decimal', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    }).format(nombre) + ' FCFA';
  };

  // Suppléments disponibles
  const supplementsDisponibles = [
    { nom: 'Sauce piquante', prix: 200 },
    { nom: 'Supplément fromage', prix: 300 },
    { nom: 'Supplément viande', prix: 500 },
    { nom: 'Sauce barbecue', prix: 150 },
    { nom: 'Crudités', prix: 100 },
  ];

  // Fetch des plats programmés dans l'emploi du temps
  useEffect(() => {
    const fetchPlatsProgrammes = async () => {
      try {
        // Récupérer les emplois du temps
        const emplois = await emploiDuTempsApi.getAll();
        
        // Extraire les IDs des plats uniques
        const platIds: number[] = [...new Set(emplois.map(e => 
          typeof e.plat === 'object' ? e.plat.id : e.plat
        ))];
        
        // Récupérer les détails de chaque plat
        const platsPromises = platIds.map(id => platsApi.getById(id));
        const platsDetails = await Promise.all(platsPromises);
        
        // Associer chaque plat à ses créneaux
        const platsAvecCreneaux = platsDetails.map(plat => {
          const platId = plat.id;
          return {
            ...plat,
            creneaux: emplois.filter(e => {
              const emploiPlatId = typeof e.plat === 'object' ? e.plat.id : e.plat;
              return emploiPlatId === platId;
            })
          };
        });
        
        setPlats(platsAvecCreneaux);
        setError(null);
      } catch (error) {
        console.error("Erreur lors du chargement des plats programmés:", error);
        setError("Impossible de charger les plats programmés");
      } finally {
        setLoading(false);
      }
    };

    fetchPlatsProgrammes();
  }, []);

  // Mise à jour du prix total
  useEffect(() => {
    if (!selectedPlat) return;
    
    const prixSupplements = supplementsSelectionnes.reduce((total, nom) => {
      const supplement = supplementsDisponibles.find(s => s.nom === nom);
      return total + (supplement?.prix || 0);
    }, 0);
    
    const total = (Number(selectedPlat.prix) + prixSupplements) * quantite;
    setPrixTotal(formatPrix(total));
  }, [selectedPlat, supplementsSelectionnes, quantite]);

  // Gestion des suppléments
  const handleSupplementChange = (nom: string) => {
    setSupplementsSelectionnes(prev => 
      prev.includes(nom)
        ? prev.filter(s => s !== nom)
        : [...prev, nom]
    );
  };

  // Gestion des étapes
  const nextStep = () => {
    if (step === 1 && !selectedPlat) {
      setError('Veuillez sélectionner un plat');
      return;
    }
    
    if (step === 2 && !selectedEmploiDuTemps) {
      setError('Veuillez sélectionner un créneau');
      return;
    }
    
    setError(null);
    
    if (step === 4) {
      handleReservation();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setError(null);
    if (step > 1) setStep(step - 1);
  };

  // Gestion de la sélection d'un plat
  const handlePlatSelect = (plat: Plat & { creneaux: EmploiDuTemps[] }) => {
    setSelectedPlat(plat);
    // Mettre à jour la liste des créneaux pour ce plat
    setEmploiDuTempsList(plat.creneaux || []);
    // Passer directement à l'étape suivante sans validation
    // car nous savons que nous venons de sélectionner un plat
    setError(null);
    setStep(2);
  };

  // Gestion de la réservation
  const handleReservation = async (): Promise<void> => {
    if (!selectedPlat || !selectedEmploiDuTemps) {
      setError('Veuillez sélectionner un plat et un créneau');
      return Promise.reject('Sélection invalide');
    }

    try {
      setIsSubmitting(true);
      
      // Convertir la date en chaîne de caractères si nécessaire
      const dateReservation = new Date(selectedEmploiDuTemps.date).toISOString().split('T')[0];
      const creneauReservation = selectedEmploiDuTemps.creneau.toString();
      
      const reservationData = {
        plat_id: selectedPlat.id,
        emploi_du_temps_id: selectedEmploiDuTemps.id,
        quantite,
        date: dateReservation,
        creneau: creneauReservation,
        supplements: supplementsSelectionnes.map(nom => {
          const supplement = supplementsDisponibles.find(s => s.nom === nom);
          return {
            nom,
            prix: supplement ? supplement.prix : 0
          };
        })
      };
      
      await createReservation(reservationData);
      showNotification("Réservation effectuée avec succès !", "success");
      
      // La redirection sera gérée par le RecapModal
      return Promise.resolve();
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      setError("Une erreur est survenue lors de la réservation");
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Affichage conditionnel du contenu en fonction de l'étape
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Choisissez votre plat</h3>
            {loading ? (
              <p>Chargement des plats...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {plats.map((plat) => (
                  <div
                    key={plat.id}
                    onClick={() => handlePlatSelect(plat)}
                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                      selectedPlat?.id === plat.id
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="h-32 sm:h-36 md:h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      {plat.image && (
                        <img
                          src={plat.image}
                          alt={plat.nom_plat}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <h4 className="font-bold text-lg text-gray-800">{plat.nom_plat}</h4>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{plat.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-blue-600 font-bold text-lg">
                        {plat.prix !== undefined ? formatPrix(plat.prix).replace(' FCFA', '') + ' FCFA' : 'Prix non disponible'}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {plat.type_plat}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="step-content">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Choisissez un créneau</h3>
            {emploiDuTempsList.length > 0 ? (
              <div className="space-y-4">
                {emploiDuTempsList.map((emploi) => (
                  <div
                    key={emploi.id}
                    onClick={() => setSelectedEmploiDuTemps(emploi)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedEmploiDuTemps?.id === emploi.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {emploi.jour} - {emploi.creneau}
                        </div>
                        <div className="text-sm text-gray-600">
                          {emploi.heure_debut} - {emploi.heure_fin}
                        </div>
                      </div>
                      {selectedEmploiDuTemps?.id === emploi.id && (
                        <div className="text-blue-600">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Aucun créneau disponible pour ce plat</p>
            )}
          </div>
        );
      
      case 3:
        return (
          <div className="step-content">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Options supplémentaires</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setQuantite(Math.max(1, quantite - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-lg font-medium">{quantite}</span>
                  <button
                    type="button"
                    onClick={() => setQuantite(quantite + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suppléments (optionnel)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {supplementsDisponibles.map(supplement => (
                    <label 
                      key={supplement.nom}
                      className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded text-blue-600"
                        checked={supplementsSelectionnes.includes(supplement.nom)}
                        onChange={() => handleSupplementChange(supplement.nom)}
                      />
                      <span>{supplement.nom}</span>
                      <span className="text-sm text-gray-500 ml-auto">+{formatPrix(supplement.prix).replace(' FCFA', '')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="step-content">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Récapitulatif</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-4">
                {selectedPlat && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plat:</span>
                      <span className="font-medium">{selectedPlat.nom_plat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix unitaire:</span>
                      <span>{formatPrix(selectedPlat.prix).replace(' FCFA', '')} FCFA</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantité:</span>
                  <span>{quantite}</span>
                </div>
                {supplementsSelectionnes.length > 0 && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-gray-600 mb-1">Suppléments :</div>
                    <ul className="space-y-1">
                      {supplementsSelectionnes.map(nom => {
                        const supplement = supplementsDisponibles.find(s => s.nom === nom);
                        return (
                          <li key={nom} className="flex justify-between">
                            <span>• {nom}</span>
                            <span>+{formatPrix(supplement?.prix || 0).replace(' FCFA', '')} FCFA</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-600">{prixTotal}</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Vérification si on peut passer à l'étape suivante
  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return selectedPlat !== null;
      case 2:
        return selectedEmploiDuTemps !== null;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };



  if (showRecap && selectedPlat && selectedEmploiDuTemps) {
    return (
      <RecapModal
        plat={selectedPlat}
        emploiDuTemps={selectedEmploiDuTemps}
        quantite={quantite}
        supplements={supplementsSelectionnes}
        supplementsDisponibles={supplementsDisponibles}
        onClose={() => setShowRecap(false)}
        onSubmit={handleReservation}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Indicateur d'étapes */}
      <div className="relative mb-6 sm:mb-8 overflow-hidden">
        <div className="flex items-center justify-between w-full">
          {[1, 2, 3, 4].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1.5 sm:mb-2 transition-all duration-300
                    ${step >= stepNumber 
                      ? 'bg-blue-600 text-white border-2 border-blue-600 shadow-lg' 
                      : 'bg-white text-gray-400 border-2 border-gray-300'}
                    ${step >= stepNumber && stepNumber > 1 ? 'transform scale-110' : ''}`}
                >
                  <span className="text-xs sm:text-sm md:text-base">{stepNumber}</span>
                </div>
                <span className={`text-[10px] xs:text-xs sm:text-sm font-medium text-center px-1 ${step >= stepNumber ? 'text-blue-600' : 'text-gray-500'}`}>
                  {stepNumber === 1 ? 'Choix du plat' : 
                   stepNumber === 2 ? 'Créneau' : 
                   stepNumber === 3 ? 'Options' : 'Validation'}
                </span>
              </div>
              {stepNumber < 4 && (
                <div className={`h-1 flex-1 mx-1 sm:mx-2 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'} rounded-full`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Contenu de l'étape */}
      {renderStepContent()}

      {/* Boutons de navigation */}
      <div className="flex justify-between mt-12 pt-6 border-t border-gray-200">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            step === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:shadow-md transform hover:-translate-y-0.5'
          }`}
        >
          ← Précédent
        </button>
        
        {step < 4 ? (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className={`px-8 py-3 rounded-lg font-medium text-white transition-all ${
              canProceed()
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={() => setShowRecap(true)}
            disabled={!canProceed()}
            className="px-8 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirmer la réservation
          </button>
        )}
      </div>
    </div>
  );
};

export default ImprovedWizardSteps;
