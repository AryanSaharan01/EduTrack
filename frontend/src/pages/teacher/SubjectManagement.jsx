import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";
import AppLink from "../../components/AppLink.jsx";

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/teacher/subjects")
      .then(res => setSubjects(res.data.subjects))
      .catch(err => {
        console.error(err);
        setError("Failed to load subjects");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page text-center">Loading subjects...</div>;
  if (error) return <div className="page text-center text-red-600">{error}</div>;

  return (
    <div className="page">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Your Subjects
      </h1>
      
      <AppLink 
        to="/teacher/setup" 
        className="btn-primary mb-6 inline-block"
      >
        Add New Subject
      </AppLink>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map(subject => (
          <div 
            key={subject.id} 
            className="card flex flex-col justify-between"
          >
            <div>
              <h2 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white">
                {subject.name} ({subject.code})
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                {subject.description || "No description"}
              </p>
            </div>
            <div className="flex justify-between gap-2">
              <AppLink 
                to={`/teacher/subjects/${subject.id}`} 
                className="btn-secondary"
              >
                View Details
              </AppLink>
              <button 
                className="btn-secondary" 
                disabled
              >
                Edit
              </button>
              <button 
                className="btn-secondary text-red-600" 
                disabled
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {subjects.length === 0 && (
          <p className="text-gray-700 dark:text-gray-300 col-span-full text-center">
            You don't have any subjects assigned yet.
          </p>
        )}
      </div>
    </div>
  );
}