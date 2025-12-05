import { useState, useCallback } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((type, message, duration = 3000) => {
    setNotification({ type, message });
    
    if (duration > 0) {
      setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const success = useCallback((message) => {
    showNotification('success', message);
  }, [showNotification]);

  const error = useCallback((message) => {
    showNotification('error', message);
  }, [showNotification]);

  const warning = useCallback((message) => {
    showNotification('warning', message);
  }, [showNotification]);

  const info = useCallback((message) => {
    showNotification('info', message);
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    success,
    error,
    warning,
    info
  };
};
