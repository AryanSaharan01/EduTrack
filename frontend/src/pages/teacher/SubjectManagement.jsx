import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";
import AppLink from "../../components/AppLink.jsx";

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.get("/teacher/subjects")
      .then(res => setSubjects(res.data.subjects))
      .catch(err => {
        console.error(err);
        setError("Failed to load subjects");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl animate-spin mx-auto mb-4" 
               style={{ animationDuration: '3s' }} />
          <p className="text-slate-600 font-medium mt-3">Loading subjects...</p>
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
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">📚</span>
                <span>Subject Management</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Your Subjects
                </span>
              </h1>
              <p className="text-base text-slate-600">
                Manage your courses and track student progress
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                <span className="text-4xl">🎓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Add Subject Bar */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search subjects by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
            />
          </div>
          <AppLink 
            to="/teacher/setup" 
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Subject
          </AppLink>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Subjects</p>
                <p className="text-2xl font-bold text-slate-900">{subjects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Active Courses</p>
                <p className="text-2xl font-bold text-slate-900">{subjects.filter(s => s.status !== 'archived').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-slate-900">{subjects.reduce((sum, s) => sum + (s.studentCount || 0), 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        {filteredSubjects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 border border-slate-200 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchQuery ? "No subjects found" : "No Subjects Yet"}
            </h3>
            <p className="text-slate-600 mb-6">
              {searchQuery 
                ? `No subjects match "${searchQuery}". Try a different search term.`
                : "You don't have any subjects assigned yet. Create your first subject to get started."
              }
            </p>
            {!searchQuery && (
              <AppLink 
                to="/teacher/setup"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Subject
              </AppLink>
            )}
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((subject, index) => {
              const colors = [
                { gradient: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50", border: "border-blue-200" },
                { gradient: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50", border: "border-purple-200" },
                { gradient: "from-green-500 to-emerald-500", bg: "from-green-50 to-emerald-50", border: "border-green-200" },
                { gradient: "from-orange-500 to-red-500", bg: "from-orange-50 to-red-50", border: "border-orange-200" },
                { gradient: "from-indigo-500 to-purple-500", bg: "from-indigo-50 to-purple-50", border: "border-indigo-200" },
                { gradient: "from-teal-500 to-cyan-500", bg: "from-teal-50 to-cyan-50", border: "border-teal-200" }
              ];
              const color = colors[index % colors.length];

              return (
                <div 
                  key={subject.id} 
                  className="group bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all overflow-hidden"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-br ${color.bg} border-b ${color.border} p-6`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-14 h-14 bg-gradient-to-br ${color.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                        <span className="text-3xl">📚</span>
                      </div>
                      <span className="px-3 py-1 bg-white/80 text-slate-700 rounded-lg text-xs font-bold shadow-sm">
                        {subject.code}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {subject.name}
                    </h2>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {subject.description || "No description provided"}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Students
                        </span>
                        <span className="font-semibold text-slate-900">{subject.studentCount || 0}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Tasks
                        </span>
                        <span className="font-semibold text-slate-900">{subject.taskCount || 0}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Status
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          subject.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {subject.status || 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <AppLink 
                        to={`/teacher/subjects/${subject.id}`} 
                        className={`flex-1 text-center bg-gradient-to-r ${color.gradient} text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
                      </AppLink>
                      
                      <button 
                        className="bg-slate-100 text-slate-700 font-semibold px-4 py-3 rounded-xl hover:bg-slate-200 transition-all"
                        title="Edit subject"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      <button 
                        className="bg-red-100 text-red-700 font-semibold px-4 py-3 rounded-xl hover:bg-red-200 transition-all"
                        title="Delete subject"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}