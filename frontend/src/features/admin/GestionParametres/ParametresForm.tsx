import React, { useState, useEffect } from "react";
import { useNotification } from "../../../hooks/useNotification";
import { adminApi } from "../../../api/admin";
import { Parametres } from "../../../types/models";

export const ParametresForm: React.FC = () => {
  const [parametres, setParametres] = useState<Parametres>({
    heure_limite_reservation: "",
    nombre_max_reservations: 0,
    delai_annulation: 0,
    message_accueil: "",
  });
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadParametres();
  }, []);

  const loadParametres = async () => {
    try {
      const data = await adminApi.getParametres();
      setParametres(data);
    } catch (error) {
      showNotification("Erreur lors du chargement des paramètres", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.updateParametres(parametres);
      showNotification("Paramètres mis à jour avec succès", "success");
    } catch (error) {
      showNotification("Erreur lors de la mise à jour des paramètres", "error");
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des paramètres</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Heure limite de réservation
              </label>
              <input
                type="time"
                value={parametres.heure_limite_reservation}
                onChange={(e) =>
                  setParametres({ ...parametres, heure_limite_reservation: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre maximum de réservations
              </label>
              <input
                type="number"
                value={parametres.nombre_max_reservations}
                onChange={(e) =>
                  setParametres({
                    ...parametres,
                    nombre_max_reservations: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Délai d'annulation (en heures)
              </label>
              <input
                type="number"
                value={parametres.delai_annulation}
                onChange={(e) =>
                  setParametres({
                    ...parametres,
                    delai_annulation: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Message d'accueil
            </label>
            <textarea
              value={parametres.message_accueil}
              onChange={(e) =>
                setParametres({ ...parametres, message_accueil: e.target.value })
              }
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
}; 