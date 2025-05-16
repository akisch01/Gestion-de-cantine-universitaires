import React, { useState, useEffect } from "react";
import { useNotification } from "../../hooks/useNotification";
import { apiClient } from "../../api/client";
import { Notification } from "../../types/models";

export const NotificationCenter: React.FC = () => {
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

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchNotifications();
    // Rafraîchir les notifications toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      showNotification("Erreur lors du chargement des notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await apiClient.post(`/notifications/${notificationId}/marquer_comme_lue/`);
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId ? { ...notification, est_lue: true } : notification
      );
      setNotifications(updatedNotifications);
      showNotification("Notification marquée comme lue", "success");
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      showNotification("Erreur lors du marquage de la notification", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Marquer chaque notification comme lue individuellement
      const promises = notifications
        .filter(notification => !notification.est_lue)
        .map(notification => 
          apiClient.post(`/notifications/${notification.id}/marquer_comme_lue/`)
        );
      
      await Promise.all(promises);
      
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        est_lue: true
      }));
      setNotifications(updatedNotifications);
      showNotification("Toutes les notifications ont été marquées comme lues", "success");
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
      showNotification("Erreur lors du marquage de toutes les notifications", "error");
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette notification ?')) {
      return;
    }
    
    try {
      await apiClient.delete(`/notifications/${notificationId}/supprimer/`);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      showNotification("Notification supprimée avec succès", "success");
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      showNotification("Erreur lors de la suppression de la notification", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-3 text-gray-600 dark:text-gray-400">Chargement des notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchNotifications}
          className="mt-3 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Notifications ({notifications.length})
        </h1>
        {notifications.some((n) => !n.est_lue) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm sm:text-base px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors whitespace-nowrap"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="mt-2">Aucune notification pour le moment</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                !notification.est_lue 
                  ? "border-l-4 border-blue-500" 
                  : "border-l-4 border-transparent"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">
                      {notification.titre}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      aria-label="Supprimer la notification"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  {notification.contenu && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      {notification.contenu}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <time dateTime={notification.date_envoi}>
                        {formatDate(notification.date_envoi)}
                      </time>
                    </p>
                    {!notification.est_lue && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 whitespace-nowrap px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded transition-colors"
                      >
                        Marquer lu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};