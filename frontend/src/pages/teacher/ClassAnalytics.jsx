import React, { useState, useEffect } from "react";
import api from "../../utils/api.js";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function ClassAnalytics() {
  const [subjects, setSubjects] = useState([]);
  const [filter, setFilter] = useState({
    subject: "",
    course: "",
    section: ""
  });
  const [classStats, setClassStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subjects on mount
  useEffect(() => {
    api.get("/teacher/subjects")
      .then(res => {
        setSubjects(res.data.subjects || []);
        // Set first subject as default
        if (res.data.subjects && res.data.subjects.length > 0) {
          setFilter(prev => ({ ...prev, subject: res.data.subjects[0].id }));
        }
      })
      .catch(err => {
        console.error("Failed to fetch subjects:", err);
        // Load mock data for demo
        const mockSubjects = [
          { id: "1", name: "Python Programming" },
          { id: "2", name: "Web Development" },
          { id: "3", name: "Data Structures" }
        ];
        setSubjects(mockSubjects);
        setFilter(prev => ({ ...prev, subject: mockSubjects[0].id }));
      });
  }, []);

  // Fetch analytics when subject changes
  useEffect(() => {
    if (!filter.subject) return;
    
    setLoading(true);
    setError(null);
    
    api.get(`/performance/class/${filter.subject}`)
      .then(res => setClassStats(res.data))
      .catch(err => {
        console.error(err);
        // Load mock data for demo
        setClassStats({
          classAverage: 78.5,
          topper: { name: "Alice Johnson", marks: 95 },
          lowestPerformer: { name: "Bob Smith", marks: 45 },
          taskDifficultyIndex: "Medium",
          totalStudents: 45,
          completionRate: [
            { name: "Completed", value: 32 },
            { name: "In Progress", value: 8 },
            { name: "Not Started", value: 5 }
          ],
          performanceMatrix: [
            { task: "Task 1", averageMarks: 85, maxMarks: 100 },
            { task: "Task 2", averageMarks: 72, maxMarks: 100 },
            { task: "Task 3", averageMarks: 80, maxMarks: 100 },
            { task: "Task 4", averageMarks: 68, maxMarks: 100 },
            { task: "Task 5", averageMarks: 90, maxMarks: 100 }
          ],
          trendData: [
            { week: "Week 1", average: 65 },
            { week: "Week 2", average: 70 },
            { week: "Week 3", average: 75 },
            { week: "Week 4", average: 78.5 }
          ]
        });
      })
      .finally(() => setLoading(false));
  }, [filter.subject]);

  if (error && !classStats) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Data</h2>
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
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">📊</span>
                <span>Class Analytics</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Performance Dashboard
                </span>
              </h1>
              <p className="text-base text-slate-600">
                Comprehensive insights into class performance and progress
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                <span className="text-4xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔍</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Filter Options</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Subject
              </label>
              <select
                value={filter.subject}
                onChange={e => setFilter({ ...filter, subject: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
              >
                <option value="">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Course (Optional)
              </label>
              <select
                value={filter.course}
                onChange={e => setFilter({ ...filter, course: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
              >
                <option value="">All Courses</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Section (Optional)
              </label>
              <select
                value={filter.section}
                onChange={e => setFilter({ ...filter, section: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
              >
                <option value="">All Sections</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-semibold">Loading analytics...</p>
          </div>
        ) : classStats ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
                    AVERAGE
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-600 mb-1">Class Average</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {classStats.classAverage?.toFixed(1)}%
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                    TOP
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-600 mb-1">Topper</h3>
                <p className="text-lg font-bold text-slate-900 truncate">{classStats.topper?.name || "-"}</p>
                <p className="text-sm text-green-600 font-semibold">{classStats.topper?.marks || "-"} marks</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">📉</span>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-lg">
                    LOW
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-600 mb-1">Needs Attention</h3>
                <p className="text-lg font-bold text-slate-900 truncate">{classStats.lowestPerformer?.name || "-"}</p>
                <p className="text-sm text-orange-600 font-semibold">{classStats.lowestPerformer?.marks || "-"} marks</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">
                    TOTAL
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-600 mb-1">Total Students</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {classStats.totalStudents || 0}
                </p>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Completion Rate Pie Chart */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📋</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Completion Rate</h2>
                      <p className="text-xs text-slate-600">Task completion status distribution</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={classStats.completionRate}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {classStats.completionRate?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b',
                          border: 'none',
                          borderRadius: '0.75rem',
                          color: 'white'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Performance Trend Line Chart */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📈</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Performance Trend</h2>
                      <p className="text-xs text-slate-600">Weekly average progression</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={classStats.trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="week" 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        stroke="#cbd5e1"
                      />
                      <YAxis 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        stroke="#cbd5e1"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b',
                          border: 'none',
                          borderRadius: '0.75rem',
                          color: 'white'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="average" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Performance Matrix Bar Chart */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Performance Matrix</h2>
                    <p className="text-xs text-slate-600">Average marks per task</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={classStats.performanceMatrix}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="task" 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      stroke="#cbd5e1"
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                      stroke="#cbd5e1"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b',
                        border: 'none',
                        borderRadius: '0.75rem',
                        color: 'white'
                      }}
                    />
                    <Bar 
                      dataKey="averageMarks" 
                      fill="url(#colorGradient)" 
                      radius={[8, 8, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-slate-200">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Data Available</h3>
            <p className="text-slate-600">Select a subject to view analytics</p>
          </div>
        )}

      </div>
    </div>
  );
}


