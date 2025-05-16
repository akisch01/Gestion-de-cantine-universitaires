import React, { useState, useEffect } from "react";
import { useNotification } from "../../../hooks/useNotification";
import { adminApi } from "../../../api/admin";
import { Avis } from "../../../types/models";

export const AvisTable: React.FC = () => {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    loadAvis();
  }, []);

  const loadAvis = async () => {
    try {
      const data = await adminApi.getAllAvis();
      setAvis(data);
    } catch (error) {
      showNotification("Erreur lors du chargement des avis", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await adminApi.approveAvis(id);
      showNotification("Avis approuvé avec succès", "success");
      loadAvis();
    } catch (error) {
      showNotification("Erreur lors de l'approbation de l'avis", "error");
    }
  };

  const handleDisapprove = async (id: number) => {
    try {
      await adminApi.disapproveAvis(id);
      showNotification("Avis désapprouvé avec succès", "success");
      loadAvis();
    } catch (error) {
      showNotification("Erreur lors de la désapprobation de l'avis", "error");
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des avis</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Étudiant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commentaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {avis.map((avis) => (
              <tr key={avis.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{avis.etudiant.nom}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{avis.plat.nom}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{avis.note}/5</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{avis.commentaire}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      avis.approuve
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {avis.approuve ? "Approuvé" : "En attente"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {!avis.approuve && (
                    <button
                      onClick={() => handleApprove(avis.id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Approuver
                    </button>
                  )}
                  <button
                    onClick={() => handleDisapprove(avis.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Désapprouver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 