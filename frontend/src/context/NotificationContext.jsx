import React, { createContext, useState, useCallback } from "react";
import PropTypes from 'prop-types';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const addNotification = useCallback(({ message, type = "info" }) => {
    if (!message) {
      console.error("Notification message is required");
      return;
    }

    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timeoutId = setTimeout(() => removeNotification(id), 5000);

    setNotifications((prev) => [
      ...prev,
      { 
        id, 
        message, 
        type,
        timeoutId // Store timeout ID for cleanup
      }
    ]);

    return id;
  }, [removeNotification]);

  // Cleanup timeouts when component unmounts
  React.useEffect(() => {
    return () => {
      notifications.forEach(notification => {
        if (notification.timeoutId) {
          clearTimeout(notification.timeoutId);
        }
      });
    };
  }, [notifications]);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        removeNotification 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};