import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    message: string, 
    type: 'info' | 'success' | 'error' | 'warning' = 'info'
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notification: Notification = {
      id,
      message,
      type,
      timestamp: Date.now(),
    };

    setNotifications(prev => [...prev, notification]);
    
    // Log notification for monitoring
    logger.info('Notification added', { 
      id, 
      message, 
      type,
      timestamp: notification.timestamp 
    });

    // Auto-remove after 5 seconds for non-error notifications
    if (type !== 'error') {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    logger.debug('Notification removed', { id });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    logger.debug('All notifications cleared');
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
}