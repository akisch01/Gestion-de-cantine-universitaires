import React from 'react';
import { ImprovedWizardSteps } from './ImprovedWizardSteps';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const ReservationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Retour
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Réservation de repas
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Sélectionnez votre plat, choisissez un créneau et finalisez votre commande en quelques étapes simples.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <ImprovedWizardSteps />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReservationPage;
