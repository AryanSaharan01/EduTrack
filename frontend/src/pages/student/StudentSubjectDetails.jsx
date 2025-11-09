import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api.js";
import AppLink from "../../components/AppLink.jsx";
import { TASK_STATUS, DIFFICULTY } from "../../utils/constants.js";

export default function StudentSubjectDetails() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/student/subjects/${subjectId}`)
      .then(res => {
        setSubject(res.data.subject);
        setTasks(res.data.tasks);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load subject details");
      })
      .finally(() => setLoading(false));
  }, [subjectId]);

  if (loading) {
    return <div className="page text-center text-gray-600 dark:text-gray-400">Loading subject details...</div>;
  }

  if (error) {
    return <div className="page text-center text-red-600">{error}</div>;
  }

  if (!subject) {
    return <div className="page text-center text-red-600">Subject not found.</div>;
  }

  return (
    <div className="page max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {subject.name} Details
      </h1>
      
      <p className="text-gray-700 dark:text-gray-300">{subject.description}</p>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No tasks available.</p>
        ) : (
          <ul className="grid md:grid-cols-3 gap-4">
            {tasks.map(task => (
              <li 
                key={task.id} 
                className="card flex flex-col p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800"
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {task.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Difficulty: {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Deadline: {new Date(task.deadline).toLocaleString()}
                </p>
                <div className="mt-auto pt-4 flex gap-2">
                  <AppLink 
                    to={`/student/tasks/${task.id}`} 
                    className="btn-primary"
                  >
                    View Details
                  </AppLink>
                  {task.status === "published" && (
                    <AppLink 
                      to={`/student/tasks/${task.id}/attempt`} 
                      className="btn-secondary"
                    >
                      Start Task
                    </AppLink>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}