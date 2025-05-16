import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { Notification } from '../../types/models';

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fonction utilitaire pour formater les dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return date.toLocaleString('fr-FR', options);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await apiClient.post(`/notifications/${notificationId}/marquer_comme_lue/`);
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId ? { ...notification, est_lue: true } : notification
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Rafraîchir les notifications toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = async (notificationId: number) => {
    try {
      await apiClient.post(`/notifications/${notificationId}/marquer_comme_lue/`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, est_lue: true } : n
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.est_lue).length;

  return (
    <div className="relative flex justify-end">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <span className="text-2xl md:text-3xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Overlay pour fermer en cliquant à l'extérieur */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed sm:absolute right-1/2 sm:right-0 translate-x-1/2 sm:translate-x-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                Notifications ({notifications.length})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                aria-label="Fermer les notifications"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-4 text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base">
                  Aucune notification
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      !notification.est_lue ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                          {notification.titre}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                          {formatDate(notification.date_envoi)}
                        </p>
                      </div>
                      {!notification.est_lue && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 whitespace-nowrap ml-2"
                        >
                          Marquer lu
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-3 sm:px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-center">
              <Link
                to="/notifications"
                className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Voir toutes les notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};