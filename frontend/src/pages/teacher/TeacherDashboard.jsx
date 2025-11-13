import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import AppLink from "../../components/AppLink.jsx";

export default function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch dashboard data
    api.get("/teacher/dashboard")
      .then(res => {
        setData(res.data.data);
        // Also set teacher from dashboard response if available
        if (res.data.data && res.data.data.teacher) {
          setTeacher(res.data.data.teacher);
        }
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));

    // Fetch teacher profile separately
    api.get('/teacher/profile')
      .then(res => {
        if (res.data && res.data.teacher) {
          setTeacher(res.data.teacher);
        }
      })
      .catch(err => {
        console.warn('Could not load teacher profile:', err);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl animate-spin mx-auto mb-4"
            style={{ animationDuration: '3s' }} />
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-slate-600 font-medium mt-3">Loading your dashboard...</p>
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
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Dashboard</h2>
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

  if (!data) return null;

  const quotes = [
    { text: "The mediocre teacher tells. The good teacher explains. The superior teacher demonstrates. The great teacher inspires.", author: "William Arthur Ward" },
    { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
    { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
    { text: "The art of teaching is the art of assisting discovery.", author: "Mark Van Doren" },
    { text: "A good teacher can inspire hope, ignite the imagination, and instill a love of learning.", author: "Brad Henry" }
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Safe access to stats with defaults
  const stats = data.stats || {};
  const totalSubjects = stats.totalSubjects || 0;
  const totalStudents = stats.totalStudents || 0;
  const totalTasks = stats.totalTasks || 0;
  const pendingTasks = data.pendingTasks || 0;
  const avgPerformance = data.avgPerformance || 0;
  const lastNotification = data.lastNotification || new Date().toISOString();
  const performanceTrend = data.performanceTrend || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3 animate-pulse">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                <span className="w-2 h-2 bg-indigo-500 rounded-full absolute" />
                Faculty Dashboard
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Hello, {teacher?.name || 'Teacher'}!
                </span>
                {' '}👨‍🏫
              </h1>
              <p className="text-base text-slate-600">
                Manage your classes, track student progress, and inspire learning
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                <span className="text-4xl">📚</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl">📖</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Total Subjects</p>
                <p className="text-3xl font-bold text-slate-900">{totalSubjects}</p>
              </div>
            </div>
            <AppLink to="/teacher/subjects" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 group">
              View all subjects
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AppLink>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl">👥</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Total Students</p>
                <p className="text-3xl font-bold text-slate-900">{totalStudents}</p>
              </div>
            </div>
            <AppLink to="/teacher/performance" className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 group">
              View all students
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AppLink>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl">📝</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-900">{totalTasks}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AppLink to="/teacher/tasks" className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 group">
                View tasks
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </AppLink>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Avg Performance</p>
                <p className="text-3xl font-bold text-slate-900">{avgPerformance}%</p>
              </div>
            </div>
            <AppLink to="/teacher/performance" className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 group">
              View analytics
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AppLink>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl animate-bounce">🔔</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Last Activity</p>
                <p className="text-xs font-bold text-slate-900">{new Date(lastNotification).toLocaleDateString()}</p>
              </div>
            </div>
            <AppLink to="/teacher/setup" className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-1 group">
              Add new subject
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AppLink>
          </div>

        </div>

        {/* Quote and Actions */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Quote */}
          <div className="lg:col-span-2">
            <div className="group bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 border border-indigo-200 hover:shadow-lg transition-all animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <span className="text-2xl">💭</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Inspirational Quote</h3>
              </div>
              <blockquote className="text-base italic text-slate-700 leading-relaxed mb-3 pl-4 border-l-4 border-indigo-400">
                "{randomQuote.text}"
              </blockquote>
              <p className="text-sm text-slate-600 font-semibold">— {randomQuote.author}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 h-full hover:shadow-lg transition-shadow animate-slide-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
              </div>

              <div className="space-y-3">
                <AppLink
                  to="/teacher/tasks/create"
                  className="flex items-center gap-3 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Task
                </AppLink>

                <AppLink
                  to="/teacher/setup"
                  className="flex items-center gap-3 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Subject
                </AppLink>

                <AppLink
                  to="/teacher/performance"
                  className="flex items-center gap-3 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Analytics
                </AppLink>

                <AppLink
                  to="/teacher/tasks"
                  className="flex items-center gap-3 w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View Submissions
                </AppLink>
              </div>
            </div>
          </div>

        </div>

        {/* Performance Trend Chart */}
        {performanceTrend.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Performance Trend</h2>
                <p className="text-xs text-slate-500">Class average over the last 7 days</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="marks"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ fill: '#4f46e5', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow animate-slide-up">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📋</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Recent Activities</h2>
                  <p className="text-xs text-slate-500">Latest student submissions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📭</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Recent Activities</h3>
            <p className="text-slate-600 mb-6">
              When students submit tasks, they'll appear here
            </p>
            <AppLink
              to="/teacher/tasks/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Task
            </AppLink>
          </div>
        </div>

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
      `}</style>
    </div>
  );
}