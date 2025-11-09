import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api.js";

export default function StudentSubjectDetails() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("=== SUBJECT DETAILS PAGE LOADED ===");
    console.log("Subject ID from URL:", subjectId);
  }, []);

  useEffect(() => {
    console.log("Fetching subject details for ID:", subjectId);
    
    api.get(`/student/subjects/${subjectId}`)
      .then(res => {
        console.log("Subject data received:", res.data);
        setSubject(res.data.subject);
        setTasks(res.data.tasks || []);
      })
      .catch(err => {
        console.error("Error loading subject:", err);
        console.error("Error response:", err.response);
        setError("Failed to load subject details");
      })
      .finally(() => setLoading(false));
  }, [subjectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl animate-spin mx-auto mb-4" 
               style={{ animationDuration: '3s' }} />
          <p className="text-slate-600 font-medium mt-3">Loading subject details...</p>
        </div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <p className="text-red-600 font-semibold mb-4">{error || "Subject not found"}</p>
            <button
              onClick={() => navigate("/student/subjects")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
            >
              Back to Subjects
            </button>
          </div>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    easy: { bg: "from-green-50 to-emerald-50", border: "border-green-200", text: "text-green-700", gradient: "from-green-500 to-emerald-500" },
    medium: { bg: "from-yellow-50 to-orange-50", border: "border-yellow-200", text: "text-yellow-700", gradient: "from-yellow-500 to-orange-500" },
    hard: { bg: "from-red-50 to-pink-50", border: "border-red-200", text: "text-red-700", gradient: "from-red-500 to-pink-500" }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/student/subjects")}
          className="flex items-center gap-2 text-slate-600 hover:text-purple-600 font-medium transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Subjects
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-semibold mb-3">
                <span>{subject.code}</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {subject.name}
                </span>
              </h1>
              <p className="text-base text-slate-600">
                {subject.description || "Comprehensive course materials and assignments"}
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-4xl">📖</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Completed</p>
                <p className="text-2xl font-bold text-slate-900">{tasks.filter(t => t.status === 'completed').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending</p>
                <p className="text-2xl font-bold text-slate-900">{tasks.filter(t => t.status !== 'completed').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Progress</p>
                <p className="text-2xl font-bold text-slate-900">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Available Tasks</h2>
                <p className="text-xs text-slate-500">Complete assignments and track your progress</p>
              </div>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📋</span>
              </div>
              <p className="text-base text-slate-700 font-semibold mb-1">No Tasks Yet</p>
              <p className="text-sm text-slate-600">Tasks will appear here once your instructor publishes them</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tasks.map((task) => {
                const diffColor = difficultyColors[task.difficulty] || difficultyColors.medium;
                return (
                  <div 
                    key={task.id} 
                    className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all"
                  >
                    {/* Task Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 bg-gradient-to-r ${diffColor.gradient} text-white rounded-lg text-xs font-bold shadow-sm`}>
                        {task.difficulty.toUpperCase()}
                      </div>
                      {task.status === "published" && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      )}
                    </div>

                    {/* Task Title */}
                    <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-purple-600 transition-colors">
                      {task.title}
                    </h3>

                    {/* Task Meta */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {task.questionCount || 0} Questions
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/student/tasks/${task.id}`)}
                        className="flex-1 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}