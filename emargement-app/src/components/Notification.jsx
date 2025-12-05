import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Notification = ({ notification }) => {
  if (!notification) return null;

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-indigo-500'
  };

  const Icon = icons[notification.type] || Info;

  return (
    <div 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 text-white animate-slide-down ${colors[notification.type]}`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{notification.message}</span>
    </div>
  );
};

export default Notification;
