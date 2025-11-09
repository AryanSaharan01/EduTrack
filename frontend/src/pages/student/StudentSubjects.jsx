import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";
import AppLink from "../../components/AppLink.jsx";

export default function StudentSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/student/subjects")
      .then(res => setSubjects(res.data.subjects))
      .catch(err => {
        console.error(err);
        setError("Failed to load subjects");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="page text-center text-gray-600 dark:text-gray-400">Loading subjects...</div>;
  }

  if (error) {
    return <div className="page text-center text-red-600">{error}</div>;
  }

  return (
    <div className="page max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Your Subjects</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {subjects.map(subject => (
          <div 
            key={subject.id} 
            className="card p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {subject.name} ({subject.code})
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {subject.description || "No description."}
            </p>
            <AppLink 
              to={`/student/subjects/${subject.id}`} 
              className="btn-primary inline-block"
            >
              View Details
            </AppLink>
          </div>
        ))}
        
        {!subjects.length && (
          <p className="col-span-3 text-center text-gray-600 dark:text-gray-400">
            You have not enrolled in any subjects yet.
          </p>
        )}
      </div>
    </div>
  );
}