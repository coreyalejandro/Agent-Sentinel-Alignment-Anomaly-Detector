
import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface Props {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const NotificationOverlay: React.FC<Props> = ({ notifications, onRemove }) => {
  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} onRemove={onRemove} />
      ))}
    </div>
  );
};

const NotificationItem: React.FC<{ notification: Notification; onRemove: (id: string) => void }> = ({ notification, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(notification.id), 4000);
    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-indigo-400" />,
  };

  const bgColors = {
    success: 'bg-slate-900 border-emerald-500/30',
    error: 'bg-slate-900 border-rose-500/30',
    info: 'bg-slate-900 border-indigo-500/30',
  };

  return (
    <div className={`pointer-events-auto flex items-center p-4 rounded-xl border shadow-2xl animate-in slide-in-from-right-full duration-300 min-w-[300px] ${bgColors[notification.type]}`}>
      <div className="mr-3">{icons[notification.type]}</div>
      <p className="text-sm font-medium text-slate-200 flex-1">{notification.message}</p>
      <button onClick={() => onRemove(notification.id)} className="ml-4 text-slate-500 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
