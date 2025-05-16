import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { Plat } from '@/types/models';

interface PlatCardProps {
  plat: Plat;
  onReserve?: () => void;
}

// Mappage des types de plat à leurs couleurs et icônes
const typeConfig = {
  standard: {
    bg: 'from-blue-500 to-blue-600',
    icon: '🍽️',
    label: 'Standard'
  },
  vip: {
    bg: 'from-purple-500 to-pink-600',
    icon: '⭐',
    label: 'VIP'
  },
  vegetarien: {
    bg: 'from-green-500 to-emerald-600',
    icon: '🥗',
    label: 'Végétarien'
  },
  sans_gluten: {
    bg: 'from-amber-500 to-orange-500',
    icon: '🌾',
    label: 'Sans Gluten'
  },
  default: {
    bg: 'from-gray-500 to-gray-600',
    icon: '🍽️',
    label: 'Standard'
  }
};

// Formatte le prix avec deux décimales
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const HomePlatCard: React.FC<PlatCardProps> = ({ plat, onReserve }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  
  // Configuration du type de plat
  const type = typeConfig[plat.type_plat] || typeConfig.default;
  
  // Gestion du clic sur le bouton de réservation
  const handleReservationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmReservation = window.confirm(
      'Avant de réserver, veuillez vérifier si ce plat est au menu de la semaine actuelle.\n\nSouhaitez-vous continuer avec la réservation ?'
    );
    if (confirmReservation) {
      navigate(`/reservation?platId=${plat.id}`);
      onReserve?.();
    }
  };

  // Gestion du clic sur la carte
  const handleCardClick = () => {
    navigate(`/plats/${plat.id}`);
  };

  // Gestion du clic sur le bouton favori
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Ici, vous pourriez ajouter un appel API pour mettre à jour les favoris
  };

  // Gestion du clic sur le bouton panier
  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInCart(!isInCart);
    // Ici, vous pourriez ajouter un appel API pour mettre à jour le panier
  };

  // Utiliser l'image du plat ou une image par défaut
  const imageSrc = plat.image || 'https://source.unsplash.com/random/600x400/?food,meal,dish';
      
  // Ancienne fonction getTypeBadgeColor remplacée par le système typeConfig

  // Gestion du survol pour d'autres effets visuels si nécessaire

  return (
    <motion.div 
      className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* En-tête de la carte avec image */}
      <div className="relative h-40 xs:h-48 sm:h-52 md:h-56 overflow-hidden">
        {/* Badge de type */}
        <motion.div 
          className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className={`px-2 xs:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-bold text-white bg-gradient-to-r ${type.bg} shadow-md whitespace-nowrap`}>
            <span className="hidden xs:inline">{type.icon} </span>
            <span>{type.label}</span>
          </span>
        </motion.div>
        
        {/* Boutons d'action */}
        <motion.div 
          className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 flex flex-col space-y-1.5 sm:space-y-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.7,
            y: isHovered ? 0 : -10
          }}
          transition={{ duration: 0.2 }}
        >
          <button 
            onClick={handleFavoriteClick}
            className={`p-1.5 sm:p-2 rounded-full shadow-md backdrop-blur-sm transition-all ${isFavorite 
              ? 'bg-red-100 text-red-500 hover:bg-red-200' 
              : 'bg-white/90 text-gray-700 hover:bg-white'}`}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <FiHeart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={handleCartClick}
            className={`p-1.5 sm:p-2 rounded-full shadow-md backdrop-blur-sm transition-all ${isInCart 
              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
              : 'bg-white/90 text-gray-700 hover:bg-white'}`}
            aria-label={isInCart ? 'Retirer du panier' : 'Ajouter au panier'}
          >
            <FiShoppingCart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isInCart ? 'fill-current' : ''}`} />
          </button>
        </motion.div>
        
        {/* Image du plat */}
        <AnimatePresence mode="wait">
          <motion.div
            key="plat-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
              src={imageSrc} 
              alt={plat.nom_plat}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://source.unsplash.com/random/600x400/?food,meal,dish';
              }}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Badge de prix */}
        <motion.div 
          className={`absolute bottom-3 sm:bottom-4 left-3 sm:left-4 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-white font-bold shadow-lg text-xs sm:text-sm ${
            plat.prix > 3000 
              ? 'bg-gradient-to-r from-red-500 to-pink-600' 
              : plat.prix > 2000 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600'
          }`}
          initial={{ scale: 0.9, opacity: 0.9 }}
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            opacity: 1
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {formatPrice(plat.prix)}
        </motion.div>
      </div>
      
      {/* Corps de la carte */}
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1.5 sm:mb-2">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 pr-2">
            {plat.nom_plat}
          </h3>
          
          <div className="flex-shrink-0 flex items-center bg-yellow-50 dark:bg-yellow-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            <FiStar className="text-yellow-400 w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-current" />
            <span className="ml-0.5 sm:ml-1 text-xs sm:text-sm font-medium text-yellow-700 dark:text-yellow-300">
              {plat.note_moyenne?.toFixed(1) || 'N/A'}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 line-clamp-3 flex-1">
          {plat.description || 'Aucune description disponible pour ce plat.'}
        </p>
        
        <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mt-2 sm:mt-3 md:mt-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <FiClock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
              <span className="text-xs sm:text-sm">{plat.temps_preparation || '--'} min</span>
            </div>
            <div className="flex items-center">
              <FiStar className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-yellow-400" />
              <span className="text-xs sm:text-sm">Ingrédients</span>
            </div>
          </div>
          
          <motion.button
            onClick={handleReservationClick}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 flex items-center justify-center space-x-1.5 sm:space-x-2"
          >
            <FiShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Réserver</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePlatCard;
