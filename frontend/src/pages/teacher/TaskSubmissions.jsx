import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api.js";

export default function TaskSubmissions() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [taskInfo, setTaskInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, [taskId]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/teacher/tasks/${taskId}/submissions`);
      setSubmissions(response.data.submissions || []);
      
      // Get task info (you might need to add this endpoint)
      // For now, we'll just show the submissions
      setLoading(false);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError("Failed to load submissions");
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      submitted: "bg-yellow-100 text-yellow-700",
      graded: "bg-green-100 text-green-700",
      pending: "bg-blue-100 text-blue-700"
    };
    return statusStyles[status] || statusStyles.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button
              onClick={() => navigate("/teacher/tasks")}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
            >
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200">
          <button
            onClick={() => navigate("/teacher/tasks")}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tasks
          </button>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">📊</span>
                <span>Task Submissions</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Student Submissions
                </span>
              </h1>
              <p className="text-base text-slate-600">
                View and grade student submissions for this task
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-4xl">📝</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Submissions</p>
                <p className="text-2xl font-bold text-slate-900">{submissions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Graded</p>
                <p className="text-2xl font-bold text-slate-900">
                  {submissions.filter(s => s.submission_status === 'graded').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending</p>
                <p className="text-2xl font-bold text-slate-900">
                  {submissions.filter(s => s.submission_status === 'submitted').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          {submissions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">📭</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Submissions Yet</h3>
              <p className="text-slate-600">Students haven't submitted their answers for this task yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Student</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Roll No</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Submitted At</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Answers</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Marks</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {submissions.map((submission) => (
                    <tr key={submission.submission_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {submission.student_name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{submission.student_name}</p>
                            <p className="text-xs text-slate-500">{submission.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{submission.roll_no}</td>
                      <td className="px-6 py-4 text-slate-700">
                        {new Date(submission.submitted_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                          {submission.answers_count} answers
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-slate-900">
                          {submission.total_marks_obtained || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusBadge(submission.submission_status)}`}>
                          {submission.submission_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => navigate(`/teacher/submissions/${submission.submission_id}`)}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-all shadow-md"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {submission.submission_status === 'graded' ? 'View' : 'Grade'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}