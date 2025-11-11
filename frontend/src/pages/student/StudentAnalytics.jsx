import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer 
} from "recharts";

const COLORS = ["#14b8a6", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function StudentAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    api.get("/student/analytics")
      .then(res => setData(res.data.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load analytics data");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl animate-spin mx-auto mb-4" 
               style={{ animationDuration: '3s' }} />
          <p className="text-slate-600 font-medium mt-3">Loading analytics...</p>
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">📊</span>
                <span>Performance Insights</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Analytics
                </span>
              </h1>
              <p className="text-base text-slate-600">
                Track your progress and identify areas for improvement
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                <span className="text-4xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200 flex gap-3 flex-wrap">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
              timeRange === "week"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
              timeRange === "month"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
              timeRange === "year"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            This Year
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          
          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Total Marks</p>
                <p className="text-3xl font-bold text-slate-900">{data.totalMarks || 0}</p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Accuracy</p>
                <p className="text-3xl font-bold text-slate-900">{data.accuracyPercent || 0}%</p>
              </div>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <span className="text-2xl">✅</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-500 font-semibold mb-1">Tasks Completed</p>
                <p className="text-3xl font-bold text-slate-900">{data.tasksCompleted || 0}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Marks Over Time */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Performance Trend</h2>
                <p className="text-xs text-slate-500">Your marks over time</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.markTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
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
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Subject Distribution */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Subject Distribution</h2>
                <p className="text-xs text-slate-500">Marks breakdown by subject</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
                  data={data.subjectDistribution || []} 
                  dataKey="value" 
                  nameKey="subject" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100}
                  label={(entry) => `${entry.subject}: ${entry.value}`}
                  labelLine={false}
                >
                  {(data.subjectDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

        {/* Performance per Subject */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Subject-wise Performance</h2>
              <p className="text-xs text-slate-500">Compare your scores across subjects</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.performancePerSubject || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }} 
              />
              <Legend />
              <Bar dataKey="marks" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

