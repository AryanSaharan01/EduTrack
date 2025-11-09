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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl animate-spin mx-auto mb-4" 
               style={{ animationDuration: '3s' }} />
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-slate-600 font-medium mt-3">Loading your subjects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-4xl">⚠️</span>
            </div>
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const subjectColors = [
    { gradient: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50", border: "border-purple-200", icon: "📚" },
    { gradient: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50", border: "border-blue-200", icon: "💻" },
    { gradient: "from-orange-500 to-red-500", bg: "from-orange-50 to-red-50", border: "border-orange-200", icon: "🧮" },
    { gradient: "from-green-500 to-emerald-500", bg: "from-green-50 to-emerald-50", border: "border-green-200", icon: "🔬" },
    { gradient: "from-yellow-500 to-orange-500", bg: "from-yellow-50 to-orange-50", border: "border-yellow-200", icon: "⚡" },
    { gradient: "from-teal-500 to-blue-500", bg: "from-teal-50 to-blue-50", border: "border-teal-200", icon: "🎯" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">📚</span>
                <span>Enrolled Subjects</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Subjects
                </span>
              </h1>
              <p className="text-base text-slate-600">
                Explore your enrolled subjects and access course materials
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                <span className="text-4xl">📖</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Subjects</p>
                <p className="text-2xl font-bold text-slate-900">{subjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Active Courses</p>
                <p className="text-2xl font-bold text-slate-900">{subjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        {subjects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 border border-slate-200 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Subjects Yet</h3>
            <p className="text-slate-600 mb-6">You haven't enrolled in any subjects. Contact your administrator to get started.</p>
            <AppLink to="/student/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </AppLink>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject, index) => {
              const colorScheme = subjectColors[index % subjectColors.length];
              return (
                <div 
                  key={subject.id} 
                  className="group bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-br ${colorScheme.bg} border-b ${colorScheme.border} p-6`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-14 h-14 bg-gradient-to-br ${colorScheme.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                        <span className="text-3xl">{colorScheme.icon}</span>
                      </div>
                      <span className="px-3 py-1 bg-white/80 backdrop-blur rounded-lg text-sm font-bold text-slate-700 shadow-sm">
                        {subject.code}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                      {subject.name}
                    </h2>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                      {subject.description || "Explore comprehensive course materials, assignments, and resources for this subject."}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-500 mb-1">Tasks</p>
                        <p className="text-lg font-bold text-slate-900">{subject.taskCount || 0}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-slate-500 mb-1">Progress</p>
                        <p className="text-lg font-bold text-slate-900">75%</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <AppLink 
                      to={`/student/subjects/${subject.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/student/subjects/${subject.id}`;
                      }}
                      className={`block text-center bg-gradient-to-r ${colorScheme.gradient} text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        View Details
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </AppLink>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}