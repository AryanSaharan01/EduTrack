import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api.js";
import AppLink from "../../components/AppLink.jsx";

export default function TaskSubmissions() {
  const { taskId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/tasks/${taskId}/submissions`)
      .then(res => setSubmissions(res.data.submissions))
      .catch(err => {
        console.error(err);
        setError("Failed to load submissions");
      })
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) {
    return (
      <div className="page flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-300">Loading submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="page max-w-4xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
        Submissions for Task #{taskId}
      </h1>
      
      {submissions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-center py-8">
          No submissions yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-3 border border-gray-300 dark:border-gray-700 text-left">Student</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700 text-left">Submitted At</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700 text-left">Marks</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700 text-left">Status</th>
                <th className="p-3 border border-gray-300 dark:border-gray-700 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr 
                  key={sub.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <td className="p-2 border border-gray-300 dark:border-gray-700">
                    {sub.student_name}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-700">
                    {new Date(sub.submitted_at).toLocaleString()}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-700">
                    {sub.total_marks_obtained}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-700">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      sub.submission_status === 'submitted' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sub.submission_status}
                    </span>
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-700">
                    <AppLink 
                      to={`/teacher/tasks/${taskId}/submission/${sub.id}`} 
                      className="btn-secondary text-sm"
                    >
                      View Details
                    </AppLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}