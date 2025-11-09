import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";
import AppLink from "../../components/AppLink.jsx";
import { DIFFICULTY, TASK_STATUS } from "../../utils/constants.js";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/tasks")
      .then(res => setTasks(res.data.tasks))
      .catch(err => {
        console.error(err);
        setError("Failed to load tasks");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "pending") return task.status === "published";
    if (filter === "completed") return task.status === "graded";
    return true;
  });

  if (loading) {
    return <div className="page text-center text-gray-600 dark:text-gray-400">Loading tasks...</div>;
  }

  if (error) {
    return <div className="page text-center text-red-600">{error}</div>;
  }

  return (
    <div className="page max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Lab Tasks</h1>
      
      <div className="mb-4 space-x-4">
        <button
          onClick={() => setFilter("all")}
          className={`btn ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`btn ${filter === "pending" ? "btn-primary" : "btn-secondary"}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`btn ${filter === "completed" ? "btn-primary" : "btn-secondary"}`}
        >
          Completed
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No tasks match the filter.
        </p>
      ) : (
        <ul className="grid md:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <li 
              key={task.id} 
              className="card p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800 flex flex-col"
            >
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                {task.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Difficulty: {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Status: {task.status}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Deadline: {task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}
              </p>
              <div className="mt-auto pt-3 flex space-x-2">
                <AppLink 
                  to={`/student/tasks/${task.id}`} 
                  className="btn-primary flex-1"
                >
                  View Details
                </AppLink>
                {task.status === "published" && (
                  <AppLink 
                    to={`/student/tasks/${task.id}/attempt`} 
                    className="btn-secondary flex-1"
                  >
                    Start Task
                  </AppLink>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}