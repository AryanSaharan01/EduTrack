import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/student/notifications")
      .then(res => setNotifications(res.data.notifications))
      .catch(err => {
        console.error(err);
        setError("Failed to load notifications");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page text-center text-gray-600 dark:text-gray-400">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="page max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Notifications
      </h1>
      
      {notifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          You have no new notifications.
        </p>
      ) : (
        <ul className="space-y-4">
          {notifications.map(n => (
            <li 
              key={n.id} 
              className={`
                border border-gray-200 dark:border-gray-700 
                p-4 rounded-lg 
                ${n.is_read 
                  ? "bg-gray-50 dark:bg-gray-800" 
                  : "bg-white dark:bg-gray-900"
                }
              `}
            >
              <p className="text-gray-900 dark:text-white">{n.message}</p>
              <small className="text-gray-600 dark:text-gray-400">
                {new Date(n.sent_at).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}