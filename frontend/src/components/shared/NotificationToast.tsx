import React from 'react';
import { useNotification } from '../../hooks/useNotification';

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
      {notifications.map((notification) => {
        // Définir les icônes et styles en fonction du type de notification
        const icons = {
          success: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          error: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          warning: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          info: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };

        const bgColors = {
          success: 'bg-green-100 border-green-500',
          error: 'bg-red-100 border-red-500',
          warning: 'bg-yellow-100 border-yellow-500',
          info: 'bg-blue-100 border-blue-500'
        };

        const textColors = {
          success: 'text-green-800',
          error: 'text-red-800',
          warning: 'text-yellow-800',
          info: 'text-blue-800'
        };

        const iconColors = {
          success: 'text-green-500',
          error: 'text-red-500',
          warning: 'text-yellow-500',
          info: 'text-blue-500'
        };

        const type = notification.type || 'info';

        return (
          <div
            key={notification.id}
            className={`relative p-4 rounded-lg shadow-lg border-l-4 ${bgColors[type]} ${textColors[type]} transform transition-all duration-300 animate-fade-in`}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 mt-0.5 ${iconColors[type]}`}>
                {icons[type]}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};