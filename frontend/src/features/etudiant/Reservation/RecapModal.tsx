import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plat } from '../../../types/models';
import { EmploiDuTemps } from '../../../types/models';

// Supprimé car non utilisé directement

interface RecapModalProps {
  plat: Plat;
  emploiDuTemps: EmploiDuTemps;
  quantite: number;
  supplements: string[];
  onClose: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  supplementsDisponibles?: Array<{ nom: string; prix: number }>;
}

export const RecapModal: React.FC<RecapModalProps> = ({
  plat,
  emploiDuTemps,
  quantite,
  supplements,
  onClose,
  onSubmit,
  isSubmitting,
  supplementsDisponibles = [],
}) => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // Calcul du total des suppléments
  const totalSupplements = supplements.reduce((total, nom) => {
    const supplement = supplementsDisponibles.find(s => s.nom === nom);
    return total + (supplement?.prix || 0);
  }, 0);
  
  const total = (Number(plat.prix) * quantite) + totalSupplements;
  
  const handleConfirmation = async () => {
    try {
      await onSubmit();
      setIsConfirmed(true);
      // Redirection après 1.5 secondes
      setTimeout(() => {
        navigate('/Historique');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Récapitulatif</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              aria-label="Fermer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Détails du plat */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Votre plat</h4>
              <div className="flex items-start">
                {plat.image && (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                    <img src={plat.image} alt={plat.nom_plat} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-gray-900 text-sm truncate">{plat.nom_plat}</h5>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{plat.description}</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-xs text-gray-600">Quantité: {quantite}</span>
                    <span className="text-xs font-medium text-blue-600">{formatPrix(plat.prix * quantite)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails du créneau */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Date et heure</h4>
              <div className="flex items-center">
                <div className="p-1.5 bg-blue-100 rounded-full text-blue-600 mr-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(emploiDuTemps.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-xs text-gray-600">
                    {emploiDuTemps.creneau}
                  </p>
                </div>
              </div>
            </div>

            {/* Suppléments */}
            {supplements.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Suppléments</h4>
                <div className="space-y-2">
                  {supplements.map((nom, index) => {
                    const supplement = supplementsDisponibles.find(s => s.nom === nom);
                    if (!supplement) return null;
                    return (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">• {supplement.nom}</span>
                        <span className="text-gray-900 font-medium">+{formatPrix(supplement.prix)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{formatPrix(plat.prix * quantite)}</span>
              </div>
              {totalSupplements > 0 && (
                <div className="flex justify-between items-center mt-1 text-sm">
                  <span className="text-gray-600">Suppléments</span>
                  <span className="font-medium">{formatPrix(totalSupplements)}</span>
                </div>
              )}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-blue-600">{formatPrix(total)}</span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="mt-6 flex flex-col space-y-2 sm:space-y-0 sm:flex-row-reverse sm:justify-between sm:space-x-reverse sm:space-x-3">
            <button
              type="button"
              onClick={handleConfirmation}
              className="px-4 py-2.5 text-sm border border-transparent rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all flex items-center justify-center"
              disabled={isSubmitting || isConfirmed}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">{isConfirmed ? 'Redirection...' : 'Traitement...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">Confirmer la commande</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fonction utilitaire pour formater les prix
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

export default RecapModal;
