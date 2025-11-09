import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";
import AppLink from "../../components/AppLink.jsx";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/student/dashboard")
      .then(res => setData(res.data.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page text-center">Loading dashboard...</div>;
  if (error) return <div className="page text-center text-red-600">{error}</div>;
  if (!data) return <div className="page text-center text-red-600">Failed to load dashboard data</div>;

  return (
    <div className="page space-y-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Welcome, {data.student.name}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Subjects Enrolled</h2>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{data.subjects.length}</p>
          <AppLink to="/student/subjects" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
            View All
          </AppLink>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Upcoming Tasks</h2>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{data.upcomingTasks.length}</p>
          <AppLink to="/student/tasks" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
            View All
          </AppLink>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Current Rank</h2>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{data.rank || "-"}</p>
          <AppLink to="/student/leaderboard" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
            View Leaderboard
          </AppLink>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Streak (days)</h2>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{data.streak || 0}</p>
        </div>
      </div>

      <section>
        <h2 className="font-semibold text-2xl mb-4 text-gray-900 dark:text-white">Recent Notifications</h2>
        {data.notifications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No notifications.</p>
        ) : (
          <ul className="space-y-2">
            {data.notifications.slice(0, 3).map(n => (
              <li key={n.id} className="border-b border-gray-300 dark:border-gray-700 py-2 flex justify-between items-center">
                <span className="text-gray-900 dark:text-white">{n.message}</span>
                <small className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(n.timestamp).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        )}
        <AppLink to="/student/notifications" className="mt-4 inline-block text-indigo-600 hover:text-indigo-700">
          View All Notifications
        </AppLink>
      </section>

      <section>
        <h2 className="font-semibold text-2xl mb-4 text-gray-900 dark:text-white">Upcoming Tasks</h2>
        {data.upcomingTasks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No upcoming tasks</p>
        ) : (
          <ul className="space-y-4">
            {data.upcomingTasks.map(task => (
              <li key={task.id} className="card flex justify-between items-center p-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{task.subject}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Deadline: {new Date(task.deadline).toLocaleString()}
                  </p>
                </div>
                <AppLink 
                  to={`/student/tasks/${task.id}`} 
                  className="btn-primary ml-4"
                >
                  Start Task
                </AppLink>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}



