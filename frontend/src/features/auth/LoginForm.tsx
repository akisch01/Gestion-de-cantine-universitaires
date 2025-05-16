import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export const LoginForm = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation des champs
        if (!email.trim()) {
            setError('Veuillez saisir votre adresse email');
            return;
        }
        
        if (!password) {
            setError('Veuillez saisir votre mot de passe');
            return;
        }
        
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            // La redirection est gérée par le AuthProvider après une connexion réussie
        } catch (err: any) {
            console.error('Erreur de connexion:', err);
            
            // Gestion des erreurs plus détaillée
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Email ou mot de passe incorrect');
                } else if (err.response.status >= 500) {
                    setError('Erreur serveur. Veuillez réessayer plus tard.');
                } else {
                    setError('Une erreur est survenue lors de la connexion');
                }
            } else if (err.request) {
                // La requête a été faite mais aucune réponse n'a été reçue
                setError('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
            } else {
                // Une erreur s'est produite lors de la configuration de la requête
                setError('Une erreur est survenue lors de la configuration de la requête');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-2 sm:mx-4"
            >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
                    {/* En-tête */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 sm:p-8 text-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-white">Bienvenue</h1>
                        <p className="text-blue-100 text-sm sm:text-base mt-1 sm:mt-2">Connectez-vous à votre espace</p>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Champ Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="votre@email.com"
                                />
                            </div>
                        </div>

                        {/* Champ Mot de passe */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mot de passe
                                </label>
                                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                    ) : (
                                        <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Bouton de connexion */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                loading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    <span className="text-sm sm:text-base">Connexion en cours...</span>
                                </span>
                            ) : (
                                'Se connecter'
                            )}
                        </motion.button>
                    </form>

                    {/* Lien d'inscription */}
                    <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-center border-t border-gray-100">
                        <p className="text-xs sm:text-sm text-gray-600">
                            Pas encore de compte ?{' '}
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 whitespace-nowrap">
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};