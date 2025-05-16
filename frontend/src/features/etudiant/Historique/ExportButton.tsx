import React, { useState } from "react";
import { Reservation } from "../../../types/models";
import { clientApi } from "../../../api/clientApi";
import { downloadBlob } from "../../../lib/utils";

interface ExportButtonProps {
  reservations: Reservation[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ reservations }) => {
  const [isExporting, setIsExporting] = useState(false);

  const formatReservationForExport = (reservation: any) => {
    return {
      id: reservation.id,
      plat: {
        nom: reservation.plat.nom_plat,
        prix: reservation.plat.prix,
        description: reservation.plat.description || ''
      },
      date_reservation: reservation.date_reservation,
      date_repas: reservation.emploi_du_temps.date,
      creneau: reservation.emploi_du_temps.creneau,
      quantite: reservation.quantite,
      statut: reservation.statut,
      supplements: reservation.supplements || [],
      total_prix: reservation.total_prix || (reservation.plat.prix * reservation.quantite)
    };
  };

  const handleExport = async () => {
    if (reservations.length === 0) {
      alert("Aucune réservation à exporter");
      return;
    }

    setIsExporting(true);
    
    try {
      // Formater les données pour l'export
      const formattedReservations = reservations.map(formatReservationForExport);
      
      // Générer le PDF avec les données formatées
      const blob = await clientApi.exportReservations(formattedReservations);
      
      // Télécharger le PDF
      const date = new Date().toISOString().split('T')[0];
      downloadBlob(blob, `historique-reservations-${date}.pdf`);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      if (error instanceof Error) {
        alert(`Erreur lors de la génération du PDF: ${error.message}`);
      } else {
        alert("Une erreur inattendue est survenue lors de la génération du PDF");
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || reservations.length === 0}
      className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
        isExporting || reservations.length === 0
          ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
          : 'bg-green-600 text-white hover:bg-green-700'
      }`}
    >
      {isExporting ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Génération du PDF...
        </span>
      ) : (
        <span>Exporter en PDF ({reservations.length})</span>
      )}
    </button>
  );
};