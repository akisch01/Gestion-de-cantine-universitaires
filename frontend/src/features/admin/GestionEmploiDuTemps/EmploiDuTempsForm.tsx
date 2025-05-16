import React, { useState, useEffect } from "react";
import { useNotification } from "../../../hooks/useNotification";
import { adminApi } from "../../../api/admin";
import { EmploiDuTemps } from "../../../types/models";

export const EmploiDuTempsForm: React.FC = () => {
  const [emploiDuTemps, setEmploiDuTemps] = useState<EmploiDuTemps[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadEmploiDuTemps();
  }, []);

  const loadEmploiDuTemps = async () => {
    try {
      const data = await adminApi.getEmploiDuTemps();
      setEmploiDuTemps(data);
    } catch (error) {
      showNotification("Erreur lors du chargement de l'emploi du temps", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.updateEmploiDuTemps(emploiDuTemps);
      showNotification("Emploi du temps mis à jour avec succès", "success");
    } catch (error) {
      showNotification("Erreur lors de la mise à jour de l'emploi du temps", "error");
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion de l'emploi du temps</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {emploiDuTemps.map((journee, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">{journee.jour}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heure d'ouverture
                </label>
                <input
                  type="time"
                  value={journee.heure_ouverture}
                  onChange={(e) => {
                    const newEmploiDuTemps = [...emploiDuTemps];
                    newEmploiDuTemps[index].heure_ouverture = e.target.value;
                    setEmploiDuTemps(newEmploiDuTemps);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heure de fermeture
                </label>
                <input
                  type="time"
                  value={journee.heure_fermeture}
                  onChange={(e) => {
                    const newEmploiDuTemps = [...emploiDuTemps];
                    newEmploiDuTemps[index].heure_fermeture = e.target.value;
                    setEmploiDuTemps(newEmploiDuTemps);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
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