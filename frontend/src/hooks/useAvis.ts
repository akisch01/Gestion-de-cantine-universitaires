import { useState, useEffect } from 'react';
import { avisApi } from '../api/avis';
import { Avis as ApiAvis } from '../types/models';
type Avis = ApiAvis;

export const useAvis = (platId: number) => {
  const [selectedReservation, setSelectedReservation] = useState<number | null>(null);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [moyenneNotes, setMoyenneNotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const data = await avisApi.getByPlatId(platId);
        setAvis(data);
        
        // Calcul de la moyenne des notes
        if (data.length > 0) {
          const moyenne = data.reduce((acc, a) => acc + a.note, 0) / data.length;
          setMoyenneNotes(moyenne);
        }
      } catch (err) {
        setError("Erreur lors du chargement des avis");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvis();
  }, [platId]);

  const addAvis = async (data: { note: number, commentaire: string, plat_id: number }) => {
    try {
      const newAvis = await avisApi.create(data);
      setAvis(prev => [...prev, newAvis]);
      
      // Mise à jour de la moyenne
      const nouvelleMoyenne = (moyenneNotes * avis.length + data.note) / (avis.length + 1);
      setMoyenneNotes(nouvelleMoyenne);
      
      return newAvis;
    } catch (err) {
      setError("Erreur lors de l'ajout de l'avis");
      throw err;
    }
  };

  return {
    avis,
    moyenneNotes,
    loading,
    error,
    addAvis
  };
}; 