import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api.js";

export default function TeacherTasksList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/teacher/my-tasks");
      setTasks(response.data.tasks || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading tasks...</p>
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
              onClick={() => navigate("/teacher/dashboard")}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
            >
              Back to Dashboard
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
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">📝</span>
                <span>My Tasks</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  All Tasks
                </span>
              </h1>
              <p className="text-base text-slate-600">
                View and manage all your created tasks and submissions
              </p>
            </div>
            <button
              onClick={() => navigate("/teacher/tasks/create")}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Task
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 border border-slate-200 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Tasks Yet</h3>
            <p className="text-slate-600 mb-6">
              Create your first task to get started
            </p>
            <button
              onClick={() => navigate("/teacher/tasks/create")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Task
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-xl hover:scale-105 transition-all overflow-hidden"
              >
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-indigo-200 p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{task.title}</h2>
                  <p className="text-sm text-slate-600 line-clamp-2">{task.description}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Status:</span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      task.status === 'published' ? 'bg-green-100 text-green-700' :
                      task.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Submissions:</span>
                    <span className="font-bold text-slate-900">{task.submission_count || 0}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Questions:</span>
                    <span className="font-bold text-slate-900">{task.question_count || 0}</span>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex gap-2">
                    <button
                      onClick={() => navigate(`/teacher/tasks/${task.id}/submissions`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:scale-105 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Submissions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
