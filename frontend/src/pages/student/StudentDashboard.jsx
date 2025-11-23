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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl animate-spin mx-auto mb-4" 
               style={{ animationDuration: '3s' }} />
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Check if student is enrolled
  if (!data.enrolled) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8">
        <div className="w-full max-w-7xl mx-auto px-6 space-y-6">
          
          {/* Welcome Header for Non-Enrolled Students */}
          <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold mb-3">
                  <span className="text-xl">⚠️</span>
                  <span>Not Enrolled</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                    Welcome, {data.student?.name || 'Student'}!
                  </span>
                </h1>
                <p className="text-base text-slate-600">
                  You have not been enrolled by any faculty yet. Please contact your teacher to get enrolled in courses.
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-4xl">📚</span>
                </div>
              </div>
            </div>
          </div>

          {/* Empty Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 font-semibold mb-1">Subjects Enrolled</p>
                  <p className="text-3xl font-bold text-slate-900">0</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">No subjects yet</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📝</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 font-semibold mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-slate-900">0</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">No tasks assigned</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 font-semibold mb-1">Submitted Tasks</p>
                  <p className="text-3xl font-bold text-slate-900">0</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">No submissions</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 font-semibold mb-1">Average Marks</p>
                  <p className="text-3xl font-bold text-slate-900">0.0</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">No data yet</p>
            </div>

          </div>

          {/* Information Card */}
          <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-3xl">ℹ️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">What&apos;s Next?</h3>
                <div className="space-y-3 text-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-base">
                      <strong>Contact your teacher</strong> to request enrollment in their courses
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-base">
                      Once enrolled, you&apos;ll be able to <strong>view subjects, access tasks, and track your progress</strong>
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-base">
                      Your dashboard will be populated with <strong>assignments, grades, and analytics</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State Illustration */}
          <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-slate-200">
            <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">🎓</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Your Learning Journey Awaits</h3>
            <p className="text-slate-600 max-w-md mx-auto mb-6">
              Once you&apos;re enrolled, this dashboard will come alive with your courses, assignments, and achievements.
            </p>
            <div className="flex items-center justify-center gap-4">
              <AppLink
                to="/student/profile"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                View Profile
              </AppLink>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Existing dashboard for enrolled students
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
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-sm font-semibold mb-3 animate-pulse">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-ping" />
                <span className="w-2 h-2 bg-teal-500 rounded-full absolute" />
                Active Student
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome back, {data.student?.name || 'Student'}!
                </span> 👋
              </h1>
              <p className="text-base text-slate-600">
                Ready to conquer today&apos;s challenges? Let&apos;s make it count!
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                <span className="text-4xl">🎓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl">📚</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Subjects Enrolled</p>
                <p className="text-3xl font-bold text-slate-900">{data.subjects?.length || 0}</p>
              </div>
            </div>
            <AppLink to="/student/subjects" className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 group">
              View all subjects
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AppLink>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl">📝</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Pending Tasks</p>
                <p className="text-3xl font-bold text-slate-900">{data.upcomingTasks?.length || 0}</p>
              </div>
            </div>
            <AppLink to="/student/tasks" className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 group">
              View all tasks
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AppLink>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Current Rank</p>
                <p className="text-3xl font-bold text-slate-900">#{data.rank || "-"}</p>
              </div>
            </div>
            <AppLink to="/student/leaderboard" className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-1 group">
              View leaderboard
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AppLink>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl animate-bounce">🔥</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Active Streak</p>
                <p className="text-3xl font-bold text-slate-900">{data.streak || 0} <span className="text-lg text-slate-600">days</span></p>
              </div>
            </div>
            <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Keep it up!
            </span>
          </div>

        </div>

        {/* Quote, Tip & Notifications Grid */}
        <div className="grid lg:grid-cols-3 gap-5">
          
          {/* Left Column - Quote & Tip */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Quote of the Day */}
            <div className="group bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 rounded-2xl p-6 border border-teal-200 hover:shadow-lg transition-all animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Quote of the Day</h3>
              </div>
              <blockquote className="text-base italic text-slate-700 leading-relaxed mb-3 pl-4 border-l-4 border-teal-400">
                &ldquo;{randomQuote.text}&rdquo;
              </blockquote>
              <p className="text-sm text-slate-600 font-semibold">— {randomQuote.author}</p>
            </div>

            {/* Achievement Tip */}
            <div className="group bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-all animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Achievement Tip</h3>
              </div>
              <p className="text-base text-slate-700 leading-relaxed">
                {randomTip}
              </p>
            </div>

          </div>

          {/* Right Column - Notifications */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 h-full hover:shadow-lg transition-shadow animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl animate-bounce">🔔</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
                </div>
                {data.notifications?.length > 0 && (
                  <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold animate-pulse">
                    {data.notifications.length}
                  </span>
                )}
              </div>

              {!data.notifications || data.notifications.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-3xl">✨</span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium">All caught up!</p>
                  <p className="text-xs text-slate-500 mt-1">No new notifications</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {data.notifications.slice(0, 5).map((n, index) => (
                    <div 
                      key={n.id} 
                      className="group flex gap-3 p-4 bg-slate-50 rounded-xl hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 transition-all cursor-pointer border border-transparent hover:border-teal-200 animate-slide-right"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-150 transition-transform" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-800 font-semibold mb-1">{n.message}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {new Date(n.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {data.notifications?.length > 5 && (
                <AppLink 
                  to="/student/notifications" 
                  className="block text-center text-sm text-teal-600 hover:text-teal-700 font-semibold mt-4 py-2 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  View all notifications →
                </AppLink>
              )}
            </div>
          </div>

        </div>

        {/* Upcoming Tasks */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow animate-slide-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Upcoming Tasks</h2>
                <p className="text-xs text-slate-500">Complete your assignments on time</p>
              </div>
            </div>
            <AppLink to="/student/tasks" className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 group">
              View all
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AppLink>
          </div>

          {!data.upcomingTasks || data.upcomingTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <span className="text-4xl">✅</span>
              </div>
              <p className="text-base text-slate-700 font-semibold mb-1">All caught up!</p>
              <p className="text-sm text-slate-600">No pending tasks at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.upcomingTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="group flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl hover:from-teal-50 hover:to-blue-50 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer animate-slide-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-teal-600 transition-colors">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <span className="text-lg">{task.subject}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Due {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <AppLink
                    to={`/student/tasks/${task.id}`}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                  >
                    Start Task
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </AppLink>
                </div>
              ))}
            </div>
          )}
        </section>

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

        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }

        .animate-slide-right {
          animation: slide-right 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}



