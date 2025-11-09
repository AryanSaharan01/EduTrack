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
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl animate-pulse mx-auto mb-3" />
          <p className="text-slate-600 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 font-medium text-sm">{error}</p>
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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-teal-50 text-teal-600 rounded-lg text-xs font-semibold mb-2">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                Active
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                Welcome back, {data.student.name}! 👋
              </h1>
              <p className="text-sm text-slate-600">
                Ready to conquer today's challenges? Let's make it count!
              </p>
            </div>
            <div className="hidden sm:block w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Subjects</p>
                <p className="text-2xl font-bold text-slate-900">{data.subjects.length}</p>
              </div>
            </div>
            <AppLink to="/student/subjects" className="text-xs text-teal-600 hover:text-teal-700 font-medium">
              View all →
            </AppLink>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Pending Tasks</p>
                <p className="text-2xl font-bold text-slate-900">{data.upcomingTasks.length}</p>
              </div>
            </div>
            <AppLink to="/student/tasks" className="text-xs text-orange-600 hover:text-orange-700 font-medium">
              View all →
            </AppLink>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏆</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Rank</p>
                <p className="text-2xl font-bold text-slate-900">#{data.rank || "-"}</p>
              </div>
            </div>
            <AppLink to="/student/leaderboard" className="text-xs text-yellow-600 hover:text-yellow-700 font-medium">
              View board →
            </AppLink>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium">Streak</p>
                <p className="text-2xl font-bold text-slate-900">{data.streak || 0} days</p>
              </div>
            </div>
            <span className="text-xs text-green-600 font-medium">Keep it up!</span>
          </div>

        </div>

        {/* Quote & Tip */}
        <div className="grid lg:grid-cols-2 gap-4">
          
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-5 border border-teal-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">💡</span>
              <h3 className="text-lg font-bold text-slate-800">Quote of the Day</h3>
            </div>
            <blockquote className="text-sm italic text-slate-700 mb-2">
              "{randomQuote.text}"
            </blockquote>
            <p className="text-xs text-slate-600 font-medium">— {randomQuote.author}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎯</span>
              <h3 className="text-lg font-bold text-slate-800">Achievement Tip</h3>
            </div>
            <p className="text-sm text-slate-700">
              {randomTip}
            </p>
          </div>

        </div>

        {/* Upcoming Tasks */}
        <section className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h2 className="text-lg font-bold text-slate-800">Upcoming Tasks</h2>
            </div>
            <AppLink to="/student/tasks" className="text-xs text-teal-600 hover:text-teal-700 font-medium">
              View all →
            </AppLink>
          </div>

          {data.upcomingTasks.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-3xl mb-2 block">✅</span>
              <p className="text-sm text-slate-600">All caught up! No pending tasks.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.upcomingTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{task.title}</h3>
                      <p className="text-xs text-slate-600">{task.subject} • Due {new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <AppLink
                    to={`/student/tasks/${task.id}`}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs font-medium px-4 py-2 rounded-lg hover:shadow-md transition-shadow"
                  >
                    Start →
                  </AppLink>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔔</span>
              <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
            </div>
            <AppLink to="/student/notifications" className="text-xs text-teal-600 hover:text-teal-700 font-medium">
              View all →
            </AppLink>
          </div>

          {data.notifications.length === 0 ? (
            <p className="text-sm text-slate-600 text-center py-4">No new notifications</p>
          ) : (
            <div className="space-y-2">
              {data.notifications.slice(0, 3).map(n => (
                <div key={n.id} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-800 font-medium">{n.message}</p>
                    <small className="text-xs text-slate-500">{new Date(n.timestamp).toLocaleDateString()}</small>
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



