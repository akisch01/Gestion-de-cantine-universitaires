import React, { useEffect, useState } from "react";
import { useReservation } from "../../../hooks/useReservation";
import { Reservation } from "../../../types/models";
import { ExportButton } from "./ExportButton";


export const Timeline: React.FC = () => {
  const { reservations, fetchReservations, cancelReservation } = useReservation();
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCancelling, setIsCancelling] = useState<number | null>(null);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredReservations(reservations);
    } else {
      const filteredReservations = reservations.filter((reservation) => {
        if (statusFilter === "all") return true;
        const normalizedReservationStatus = reservation.statut.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const normalizedFilterStatus = statusFilter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return normalizedReservationStatus === normalizedFilterStatus;
      });
      setFilteredReservations(filteredReservations);
    }
  }, [reservations, statusFilter]);

  const handleCancelReservation = async (reservationId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.')) {
      try {
        setIsCancelling(reservationId);
        await cancelReservation(reservationId);
        await fetchReservations();
      } catch (error) {
        console.error('Erreur lors de l\'annulation de la réservation:', error);
        alert('Une erreur est survenue lors de l\'annulation de la réservation.');
      } finally {
        setIsCancelling(null);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Historique des réservations
          </h2>
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="accepte">Accepté</option>
              <option value="refuse">Refusé</option>
              <option value="annule">Annulé</option>
            </select>
          </div>
        </div>
        <div className="w-full">
          <ExportButton reservations={filteredReservations} />
        </div>
      </div>

      <div className="space-y-6">
        {filteredReservations.map((reservation) => {
          const reservationDate = new Date(reservation.date_reservation || reservation.date_creation);
          const formattedDate = reservationDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          const mealDate = new Date(reservation.emploi_du_temps.date);
          const formattedMealDate = mealDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          });
          const platPrice = parseFloat(reservation.plat?.prix?.toString() || '0');
          const quantite = reservation.quantite || 1;
          const supplementsTotal = reservation.supplements?.reduce(
            (sum, sup) => sum + (parseFloat(sup.prix?.toString() || '0') * quantite),
            0
          ) || 0;
          const totalPrice = (platPrice * quantite) + supplementsTotal;

          return (
            <div
              key={reservation.id}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-blue-500 mb-4"
            >
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                        {reservation.plat.nom_plat}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Réservé le {formattedDate}
                      </p>
                    </div>
                    
                    <div className="ml-4 sm:ml-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                          reservation.statut === "accepte"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : reservation.statut === "en_attente"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : reservation.statut === "refuse"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        } whitespace-nowrap`}
                      >
                        {reservation.statut === "accepte"
                          ? "Accepté"
                          : reservation.statut === "en_attente"
                          ? "En attente"
                          : reservation.statut === "refuse"
                          ? "Refusé"
                          : "Expiré"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Détails du repas</h4>
                      <ul className="mt-1 space-y-1">
                        <li className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Date:</span> {formattedMealDate}
                        </li>
                        <li className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Créneau:</span> {reservation.emploi_du_temps.creneau}
                        </li>
                        <li className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Quantité:</span> {reservation.quantite}
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">Détails de paiement</h4>
                      <ul className="mt-1 space-y-1">
                        <li className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Prix unitaire:</span>
                          <span className="font-medium">{parseFloat(reservation.plat.prix.toString()).toFixed(2)} FCFA</span>
                        </li>
                        {reservation.supplements && reservation.supplements.length > 0 && (
                          <li className="border-t border-gray-200 dark:border-gray-700 pt-1 mt-1">
                            <span className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suppléments:</span>
                            <ul className="space-y-1">
                              {reservation.supplements && reservation.supplements.map((sup: any, index: number) => (
                                <li key={index} className="flex justify-between text-xs sm:text-sm">
                                  <span className="text-gray-500 dark:text-gray-400">+ {sup.nom}</span>
                                  <span>+{(parseFloat(sup.prix || '0') * (reservation.quantite || 1)).toFixed(2)} FCFA</span>
                                </li>
                              ))}
                            </ul>
                          </li>
                        )}
                        <li className="border-t border-gray-200 dark:border-gray-700 pt-1 mt-2 font-semibold flex justify-between text-sm sm:text-base">
                          <span>Total:</span>
                          <span className="text-blue-600 dark:text-blue-400">{totalPrice.toFixed(2)} FCFA</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                {reservation.statut === "accepte" && (
                  <button 
                    className="w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Voir le ticket
                  </button>
                )}
                
                {reservation.statut === "en_attente" && (
                  <button 
                    onClick={() => handleCancelReservation(reservation.id)}
                    disabled={isCancelling === reservation.id}
                    className={`w-full sm:w-auto px-4 py-2 text-xs sm:text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                      isCancelling === reservation.id 
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                        : 'bg-white text-red-600 border border-red-600 hover:bg-red-50 dark:bg-gray-700 dark:border-red-500 dark:text-red-400 dark:hover:bg-gray-600 focus:ring-red-500'
                    }`}
                  >
                    {isCancelling === reservation.id ? 'Annulation en cours...' : 'Annuler la réservation'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};