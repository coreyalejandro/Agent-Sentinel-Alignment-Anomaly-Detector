import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: number;
}

interface Props {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const getStyles = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-900/20 border-green-500/30 text-green-100';
    case 'error':
      return 'bg-red-900/20 border-red-500/30 text-red-100';
    case 'warning':
      return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-100';
    default:
      return 'bg-blue-900/20 border-blue-500/30 text-blue-100';
  }
};

export const EnhancedNotificationOverlay: React.FC<Props> = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            flex items-start space-x-3 p-4 rounded-lg border backdrop-blur-sm
            animate-in slide-in-from-right-full duration-300
            ${getStyles(notification.type)}
          `}
          role="alert"
          aria-live="polite"
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium break-words">
              {notification.message}
            </p>
            <p className="text-xs opacity-75 mt-1">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </p>
          </div>
          
          <button
            onClick={() => onRemove(notification.id)}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};