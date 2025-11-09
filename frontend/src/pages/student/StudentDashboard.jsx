import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";
import AppLink from "../../components/AppLink.jsx";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/student/dashboard")
      .then(res => setData(res.data.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl animate-pulse mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const quotes = [
    { text: "The only way to learn a new programming language is by writing programs in it.", author: "Dennis Ritchie" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
    { text: "In order to be irreplaceable, one must always be different.", author: "Coco Chanel" }
  ];

  const tips = [
    "You're 3 badges away from becoming a 'Master Coder'. Keep completing tasks with high accuracy!",
    "Maintain your streak! Complete at least one task daily to unlock the 'Consistency Champion' badge.",
    "Your performance improved by 15% this week. Keep up the momentum!",
    "Try to solve problems in multiple programming languages to boost your versatility score."
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-3">
                  <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                  Active Student
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  Welcome back, {data.student.name}! 👋
                </h1>
                <p className="text-lg text-slate-600">
                  Ready to conquer today's challenges? Let's make it count!
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-4xl">🎓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">📚</span>
              </div>
              <AppLink to="/student/subjects" className="text-teal-600 hover:text-teal-700 text-sm font-semibold">
                View →
              </AppLink>
            </div>
            <h2 className="text-sm font-semibold text-slate-600 mb-1">Subjects Enrolled</h2>
            <p className="text-4xl font-bold text-slate-900">{data.subjects.length}</p>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">📝</span>
              </div>
              <AppLink to="/student/tasks" className="text-orange-600 hover:text-orange-700 text-sm font-semibold">
                View →
              </AppLink>
            </div>
            <h2 className="text-sm font-semibold text-slate-600 mb-1">Upcoming Tasks</h2>
            <p className="text-4xl font-bold text-slate-900">{data.upcomingTasks.length}</p>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:border-yellow-300 hover:shadow-xl transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏆</span>
              </div>
              <AppLink to="/student/leaderboard" className="text-yellow-600 hover:text-yellow-700 text-sm font-semibold">
                View →
              </AppLink>
            </div>
            <h2 className="text-sm font-semibold text-slate-600 mb-1">Current Rank</h2>
            <p className="text-4xl font-bold text-slate-900">#{data.rank || "-"}</p>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:border-green-300 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔥</span>
              </div>
              <span className="text-green-600 text-sm font-semibold">Keep it up!</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-600 mb-1">Streak (days)</h2>
            <p className="text-4xl font-bold text-slate-900">{data.streak || 0}</p>
          </div>
        </div>

        {/* Quote & Tip Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Quote of the Day */}
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-3xl shadow-lg p-8 border border-teal-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">💡</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Quote of the Day</h2>
            </div>
            <blockquote className="text-lg italic text-slate-700 leading-relaxed mb-4">
              "{randomQuote.text}"
            </blockquote>
            <p className="text-sm font-semibold text-slate-600">
              - {randomQuote.author}
            </p>
          </div>

          {/* Achievement Tip */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl shadow-lg p-8 border border-orange-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Achievement Tip</h2>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {randomTip}
            </p>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <section className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Upcoming Tasks</h2>
            </div>
            <AppLink to="/student/tasks" className="text-teal-600 hover:text-teal-700 font-semibold text-sm">
              View All →
            </AppLink>
          </div>

          {data.upcomingTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <p className="text-slate-600 font-medium">All caught up! No pending tasks.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.upcomingTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="group bg-gradient-to-r from-slate-50 to-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg text-white font-bold group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-teal-600 transition">
                          {task.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">{task.subject}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(task.deadline).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <AppLink
                      to={`/student/tasks/${task.id}`}
                      className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    >
                      Start Task →
                    </AppLink>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔔</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
            </div>
            <AppLink to="/student/notifications" className="text-teal-600 hover:text-teal-700 font-semibold text-sm">
              View All →
            </AppLink>
          </div>

          {data.notifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No new notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.notifications.slice(0, 3).map(n => (
                <div
                  key={n.id}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition"
                >
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium">{n.message}</p>
                    <small className="text-xs text-slate-500">
                      {new Date(n.timestamp).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}



