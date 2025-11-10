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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/teacher/dashboard")
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
            <p className="text-red-600 font-semibold">{error}</p>
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
                  Hello, Teacher!
                </span> 👨‍🏫
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
                <p className="text-3xl font-bold text-slate-900">{data.totalSubjects}</p>
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
                <p className="text-3xl font-bold text-slate-900">{data.totalStudents}</p>
              </div>
            </div>
            <AppLink to="/teacher/students" className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 group">
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
                <p className="text-sm text-slate-500 font-semibold mb-1">Pending Tasks</p>
                <p className="text-3xl font-bold text-slate-900">{data.pendingTasks}</p>
              </div>
            </div>
            <AppLink to="/teacher/tasks/create" className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 group">
              Create new task
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </AppLink>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all cursor-pointer animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Avg Performance</p>
                <p className="text-3xl font-bold text-slate-900">{data.avgPerformance}%</p>
              </div>
            </div>
            <AppLink to="/teacher/class-analytics" className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 group">
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
                <p className="text-sm text-slate-500 font-semibold mb-1">Last Notification</p>
                <p className="text-xs font-bold text-slate-900">{new Date(data.lastNotification).toLocaleDateString()}</p>
              </div>
            </div>
            <AppLink to="/teacher/notifications" className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-1 group">
              Send notification
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
                  to="/teacher/notifications" 
                  className="flex items-center gap-3 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Send Notification
                </AppLink>

                <AppLink 
                  to="/teacher/live-preview" 
                  className="flex items-center gap-3 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Live Session
                </AppLink>
              </div>
            </div>
          </div>

        </div>

        {/* Performance Trend Chart */}
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
            <LineChart data={data.performanceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow">
                        A
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Alice Cooper</p>
                        <p className="text-xs text-slate-500">alice@university.edu</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">Fibonacci Sequence</p>
                    <p className="text-xs text-slate-500">Data Structures - Lab 3</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-slate-900">Nov 4, 2025</p>
                      <p className="text-xs text-slate-500">10:30 AM</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg font-bold text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Submitted
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <AppLink 
                      to="/teacher/tasks/1/submissions" 
                      className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </AppLink>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold shadow">
                        B
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Bob Smith</p>
                        <p className="text-xs text-slate-500">bob@university.edu</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">Binary Search Tree</p>
                    <p className="text-xs text-slate-500">Data Structures - Lab 4</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-slate-900">Nov 5, 2025</p>
                      <p className="text-xs text-slate-500">2:15 PM</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg font-bold text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <AppLink 
                      to="/teacher/tasks/2/submissions" 
                      className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </AppLink>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold shadow">
                        C
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Charlie Davis</p>
                        <p className="text-xs text-slate-500">charlie@university.edu</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">Sorting Algorithms</p>
                    <p className="text-xs text-slate-500">Algorithms - Lab 2</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold text-slate-900">Nov 6, 2025</p>
                      <p className="text-xs text-slate-500">9:45 AM</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-bold text-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Graded
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <AppLink 
                      to="/teacher/tasks/3/submissions" 
                      className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </AppLink>
                  </td>
                </tr>
              </tbody>
            </table>
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