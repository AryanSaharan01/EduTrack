import React, { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext.jsx";
import PropTypes from 'prop-types';

export default function NotificationToast() {
  const { notifications, removeNotification } = useContext(NotificationContext);

  if (!notifications.length) return null;

  const getTypeStyles = (type) => {
    switch (type) {
      case "error":
        return "bg-red-600 text-white";
      case "success":
        return "bg-green-600 text-white";
      default:
        return "bg-blue-600 text-white";
    }
  };

  return (
    <div 
      className="fixed top-5 right-5 space-y-2 z-50"
      role="region"
      aria-label="Notifications"
    >
      {notifications.map(({ id, message, type }) => (
        <div
          key={id}
          className={`
            p-4 
            rounded 
            shadow-md 
            max-w-xs 
            cursor-pointer 
            transition-all 
            duration-300 
            transform 
            hover:scale-105
            ${getTypeStyles(type)}
          `}
          role="alert"
          aria-live="polite"
          onClick={() => removeNotification(id)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Space") {
              e.preventDefault();
              removeNotification(id);
            }
          }}
        >
          {message}
        </div>
      ))}
    </div>
  );
}

NotificationToast.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['error', 'success', 'info']).isRequired
    })
  )
};
