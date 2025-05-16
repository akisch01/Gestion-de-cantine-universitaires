import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider";
import { apiClient } from "../../api/client";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  email: string;
  institut: string;
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const ProfileManager: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    institut: user?.institut || '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        institut: user.institut || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      // Vérifier si le mot de passe est modifié
      if (formData.new_password) {
        if (formData.new_password !== formData.confirm_password) {
          setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
          return;
        }
        if (!formData.current_password) {
          setMessage({ type: 'error', text: 'Le mot de passe actuel est requis.' });
          return;
        }
      }

      // Préparer les données à envoyer
      const dataToSend: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        institut: formData.institut,
      };

      // Ajouter les champs de mot de passe seulement s'ils sont remplis
      if (formData.new_password && formData.current_password) {
        dataToSend.current_password = formData.current_password;
        dataToSend.new_password = formData.new_password;
      }

      // Essayer d'abord avec PUT, puis avec PATCH si nécessaire
      try {
        await apiClient.put('/users/me/', dataToSend);
      } catch (putError: any) {
        // Si PUT échoue, essayer avec PATCH
        if (putError.response?.status === 405) {
          try {
            await apiClient.patch('/users/me/', dataToSend);
          } catch (patchError: any) {
            throw new Error(patchError.response?.data?.detail || 'Erreur lors de la mise à jour du profil');
          }
        } else {
          throw new Error(putError.response?.data?.detail || 'Erreur lors de la mise à jour du profil');
        }
      }

      // Mettre à jour les données de l'utilisateur dans le contexte d'authentification
      if (user) {
        user.first_name = formData.first_name;
        user.last_name = formData.last_name;
        user.institut = formData.institut;
      }

      setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
      
      // Réinitialiser les champs de mot de passe
      setFormData(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Une erreur est survenue lors de la mise à jour du profil.'
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 w-full">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {/* En-tête */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Mon Profil</h1>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Gérez vos informations personnelles et vos paramètres de sécurité
          </p>
        </div>

        {/* Message d'état */}
        {message && (
          <div className={`px-6 py-4 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
              : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <p>{message.text}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Section Informations personnelles */}
          <div className="px-3 sm:px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
                Informations personnelles
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Prénom
                  </label>
                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-2 border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 text-base px-4 py-2.5 transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="last_name" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nom
                  </label>
                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-2 border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 text-base px-4 py-2.5 transition-colors"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="institut" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Institut
                  </label>
                  <input
                    id="institut"
                    type="text"
                    name="institut"
                    value={formData.institut}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-2 border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 text-base px-4 py-2.5 transition-colors"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Adresse email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="block w-full rounded-lg border-2 border-gray-200 bg-gray-100 text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 text-base px-4 py-2.5 cursor-not-allowed transition-colors"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Mot de passe */}
          <div className="px-3 sm:px-4 md:px-6 py-6 md:py-8 space-y-4 md:space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
              Sécurité du compte
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="current_password" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe actuel
                </label>
                <div className="mt-1 relative">
                  <input
                    id="current_password"
                    type="password"
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-2 border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 text-base px-4 py-2.5 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="new_password" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="new_password"
                      type="password"
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-2 border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 text-base px-4 py-2.5 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirm_password" className="block text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirm_password"
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-2 border-gray-200 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 text-base px-4 py-2.5 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-semibold">Conseil de sécurité :</span> Utilisez un mot de passe fort et unique que vous n'utilisez pas pour d'autres comptes.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 bg-gray-50 dark:bg-gray-800/50 text-center sm:text-right">
            <button
              type="submit"
              className="inline-flex justify-center py-2.5 sm:py-3 px-6 sm:px-8 w-full sm:w-auto border border-transparent shadow-sm text-sm sm:text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 