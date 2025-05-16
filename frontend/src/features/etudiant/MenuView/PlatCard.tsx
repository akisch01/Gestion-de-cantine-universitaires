import React, { useState, useEffect } from "react";
import { Plat, EmploiDuTemps } from '../../../types/models';
import { useAuth } from "../../../features/auth/AuthProvider";
import { useAvis } from "../../../hooks/useAvis";
import { useReservation } from "../../../hooks/useReservation";
import apiClient from "../../../lib/apiClient";

interface ReservationRequest {
  plat_id: number;
  emploi_du_temps_id: number;
  quantite: number;
  date: string;
  creneau: string;
  supplements: any[];
}

// Déclaration du type pour l'API client
interface ApiClient {
  get: <T>(url: string) => Promise<{ data: T }>;
  post: <T>(url: string, data: any) => Promise<{ data: T }>;
}

// Assertion de type pour apiClient
const typedApiClient: ApiClient = apiClient as unknown as ApiClient;

interface ReservationResponse {
  id: number;
  statut: string;
  date: string;
  plat: {
    id: number;
    nom_plat: string;
  };
  emploi_du_temps: {
    id: number;
  };
  etudiant: {
    id: number;
  };
  quantite: number;
}  // Ajoutez d'autres propriétés si nécessaire

interface PlatCardProps {
  plat: Plat;
  // La propriété onReserve n'est pas utilisée dans le composant
  // onReserve?: (plat: Plat) => void;
}

export const PlatCard: React.FC<PlatCardProps> = ({ plat }) => {
  const { user } = useAuth();
  const [showAvisForm, setShowAvisForm] = useState(false);
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [hasReservation, setHasReservation] = useState(false);
  const [loadingReservation, setLoadingReservation] = useState(true);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const { createReservation } = useReservation();
  // Utilisation du hook useAvis avec déstructuration correcte
  const { avis, moyenneNotes, loading: avisLoading, error, addAvis } = useAvis(plat.id);
  

  useEffect(() => {
    const checkReservation = async () => {
      if (!user) {
        //console.log("Aucun utilisateur connecté");
        setLoadingReservation(false);
        return;
      }

      try {
        //console.log("Vérification des réservations pour l'utilisateur:", user.id, "et le plat:", plat.id);
        const response = await typedApiClient.get<ReservationResponse[]>(`/api/reservations/?etudiant=${user.id}&plat=${plat.id}`);
        //console.log("Réponse complète de l'API:", response);
        //console.log("Données brutes des réservations:", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          //console.log("Toutes les réservations:", response.data);
          
          // Vérifier s'il y a une réservation acceptée pour ce plat
          const acceptedReservationForThisPlat = response.data.find(reservation => {
            const status = reservation.statut?.toLowerCase();
            const isForThisPlat = reservation.plat?.id === plat.id;
            const isAccepted = status === 'accepte';
            
            //console.log("Vérification réservation:", {
            //  reservationId: reservation.id,
            //  platId: reservation.plat?.id,
            //  currentPlatId: plat.id,
            //  status,
            //  isForThisPlat,
            //  isAccepted
            //});
            
            return isForThisPlat && isAccepted;
          });
          
          const shouldShowAvisButton = !!acceptedReservationForThisPlat;
          setHasReservation(shouldShowAvisButton);
          
          //console.log("Résultat final:", {
          //  hasAcceptedReservation: shouldShowAvisButton,
          //  reservationFound: acceptedReservationForThisPlat
          //});
        } else {
          //console.log("Aucune réservation trouvée pour cet utilisateur et ce plat");
          setHasReservation(false);
        }
      } catch (err) {
        //console.error("Erreur lors de la vérification de la réservation:", err);
        setHasReservation(false);
      } finally {
        setLoadingReservation(false);
      }
    };

    checkReservation();
  }, [user, plat.id]);

  const handleReservation = async () => {
    if (!user) return;
    
    try {
      // Obtenir l'emploi du temps actuel
      const response = await typedApiClient.get<EmploiDuTemps[]>(`/api/emploi-du-temps/?plat=${plat.id}&date=${new Date().toISOString().split('T')[0]}`);
      const emploiDuTemps = response.data[0];
      
      if (!emploiDuTemps) {
        throw new Error("Aucun emploi du temps disponible pour ce plat aujourd'hui");
      }

      const reservationData: ReservationRequest = {
        plat_id: plat.id,
        emploi_du_temps_id: emploiDuTemps.id,
        quantite: 1,
        date: new Date().toISOString().split('T')[0],
        creneau: 'midi',
        supplements: []
      };
      await createReservation(reservationData);
      
      setHasReservation(true);
      setShowReservationForm(false);
    } catch (err) {
      //console.error("Erreur lors de la création de la réservation:", err);
    }
  };

  const handleSubmitAvis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      // Création d'un objet d'avis conforme au type attendu par l'API
      const avisData = {
        note,
        commentaire,
        plat_id: plat.id
        // etudiant_id n'est pas nécessaire car l'utilisateur est authentifié côté serveur
      };
      
      await addAvis(avisData);
      setShowAvisForm(false);
      setNote(0);
      setCommentaire('');
    } catch (err) {
      //console.error('Erreur lors de l\'ajout de l\'avis:', err);
      alert('Une erreur est survenue lors de l\'ajout de l\'avis');
    }
  };
  


  // Affichage du chargement si nécessaire
  if (avisLoading) {
    return <div>Chargement des avis...</div>;
  }

  if (error) {
    //console.error('Erreur lors du chargement des avis:', error);
  }

  // Gestion des événements tactiles pour mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Empêcher le comportement par défaut pour éviter les conflits
    e.stopPropagation();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        touchAction: 'manipulation'
      }}
    >
      <img 
        src={plat.image} 
        alt={plat.nom_plat} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{plat.nom_plat}</h3>
          <span className="text-blue-600 font-bold">
            {(Number(plat.prix) || 0).toFixed(2)} FCFA
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{plat.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {plat.type_plat}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-sm">{moyenneNotes.toFixed(1)}</span>
            <span className="text-gray-500 text-sm ml-1">({avis.length})</span>
          </div>
        </div>

        <div className="space-y-2">
          {/* Bouton de réservation toujours visible */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (!user) {
                alert('Veuillez vous connecter pour réserver');
                return;
              }
              setShowReservationForm(true);
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            {user ? 'Réserver ce plat' : 'Se connecter pour réserver'}
          </button>

          {/* Bouton pour laisser un avis uniquement si réservation acceptée pour ce plat */}
          {hasReservation && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowAvisForm(!showAvisForm);
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors mt-2"
            >
              {showAvisForm ? 'Fermer le formulaire' : 'Laisser un avis'}
            </button>
          )}
        </div>
      </div>

      {/* Formulaire d'avis */}
      {showAvisForm && (
        <div className="p-4 border-t">
          <h4 className="font-medium mb-2">Votre avis</h4>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmitAvis(e);
          }}>
            <div className="mb-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNote(star)}
                    className={`text-2xl ${star <= note ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                className="w-full p-2 border rounded text-sm"
                rows={2}
                placeholder="Votre commentaire..."
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAvisForm(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de confirmation de réservation */}
      {showReservationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="font-semibold mb-3">Confirmer la réservation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Êtes-vous sûr de vouloir réserver "{plat.nom_plat}" ?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReservationForm(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleReservation}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};