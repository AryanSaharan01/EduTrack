import React, { useState, useEffect } from "react";
import api from "../../utils/api.js";
import AppLink from "../../components/AppLink.jsx";
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function StudentPerformance() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch students on mount
  useEffect(() => {
    setStudentsLoading(true);
    api.get("/teacher/students")
      .then(res => {
        setStudents(res.data.students || []);
        // Auto-select first student
        if (res.data.students && res.data.students.length > 0) {
          setSelectedStudentId(res.data.students[0].id);
        }
      })
      .catch(err => {
        console.error("Failed to load students:", err);
        setStudents([]);
      })
      .finally(() => {
        setStudentsLoading(false);
      });
  }, []);

  // Fetch performance data when student is selected
  useEffect(() => {
    if (!selectedStudentId) return;
    
    setLoading(true);
    setError(null);
    setPerformanceData(null);
    
    api.get(`/performance/student/${selectedStudentId}`)
      .then(res => setPerformanceData(res.data.data))
      .catch(err => {
        console.error("Failed to load performance:", err);
        setError('Failed to load performance for this student. Please try again.');
        setPerformanceData(null);
      })
      .finally(() => setLoading(false));
  }, [selectedStudentId]);

  // Show loading state for students
  if (studentsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-slate-600 font-semibold">Loading students...</p>
        </div>
      </div>
    );
  }

  // Show "no students" message if list is empty
  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 w-full">
        <div className="px-8 py-6 space-y-6">
          
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3">
                  <span className="text-xl">📊</span>
                  <span>Performance Analysis</span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Student Performance
                  </span>
                </h1>
                <p className="text-base text-slate-600">
                  Detailed analytics and progress tracking
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-4xl">🎯</span>
                </div>
              </div>
            </div>
          </div>

          {/* No Students Message */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">👥</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No Students Found</h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Either no students are enrolled in your subjects or we could not fetch them. 
                Visit Subject Management to enroll students.
              </p>
              <AppLink
                to="/teacher/subjects"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Go to Subject Management
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">📊</span>
                <span>Performance Analysis</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Student Performance
                </span>
              </h1>
              <p className="text-base text-slate-600">
                Detailed analytics and progress tracking
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                <span className="text-4xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student Selection */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-xl">👤</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Select Student</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Student Name
              </label>
              <select
                value={selectedStudentId || ""}
                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
              >
                <option value="">Select a student</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            {selectedStudent && (
              <div className="flex items-end">
                <div className="w-full p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Currently Viewing</p>
                  <p className="text-lg font-bold text-slate-900">{selectedStudent.name}</p>
                  {selectedStudent.roll_no && (
                    <p className="text-xs text-slate-500">Roll No: {selectedStudent.roll_no}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-semibold">Loading performance data...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-red-200">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Performance</h3>
            <p className="text-red-600 font-semibold mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null);
                if (selectedStudentId) {
                  setLoading(true);
                  api.get(`/performance/student/${selectedStudentId}`)
                    .then(res => setPerformanceData(res.data.data))
                    .catch(err => {
                      console.error("Failed to load performance:", err);
                      setError('Failed to load performance for this student. Please try again.');
                      setPerformanceData(null);
                    })
                    .finally(() => setLoading(false));
                }
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
            >
              Retry
            </button>
          </div>
        ) : performanceData ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">📊</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
                    AVG
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-600 mb-1">Average Marks</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {performanceData.average_marks?.toFixed(1) || '0.0'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Out of 100</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-lg">
                    ACC
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-600 mb-1">Accuracy Rate</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {performanceData.average_accuracy?.toFixed(1) || '0.0'}%
                </p>
                <p className="text-xs text-slate-500 mt-1">Overall accuracy</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                  <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">
                    DONE
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-600 mb-1">Completed</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {performanceData.completed_tasks || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Tasks finished</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">📋</span>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-lg">
                    TOTAL
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-600 mb-1">Total Tasks</h3>
                <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {performanceData.total_tasks || 0}
                </p>
                <p className="text-xs text-slate-500 mt-1">Assigned tasks</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Performance Bar Chart */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📊</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Task Performance</h2>
                      <p className="text-xs text-slate-600">Marks obtained per task</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {performanceData.tasks && performanceData.tasks.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceData.tasks}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="taskName" 
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
                            color: '#ffffff'
                          }}
                          labelStyle={{ color: '#ffffff' }}
                          itemStyle={{ color: '#ffffff' }}
                        />
                        <Bar dataKey="marks" radius={[8, 8, 0, 0]}>
                          {performanceData.tasks.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-slate-500">
                      No task data available
                    </div>
                  )}
                </div>
              </div>

              {/* Improvement Trend Line Chart */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📈</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Improvement Trend</h2>
                      <p className="text-xs text-slate-600">Performance over time</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {performanceData.trend && performanceData.trend.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData.trend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="date" 
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
                            color: '#ffffff'
                          }}
                          labelStyle={{ color: '#ffffff' }}
                          itemStyle={{ color: '#ffffff' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="marks" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ fill: '#10b981', r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-slate-500">
                      No trend data available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">💪</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Strengths</h2>
                  </div>
                </div>
                <div className="p-6">
                  {performanceData.strengths && performanceData.strengths.length > 0 ? (
                    <ul className="space-y-3">
                      {performanceData.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                            ✓
                          </div>
                          <span className="font-semibold text-slate-900">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-600 text-center py-4">No strengths identified yet</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-red-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📌</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Areas for Improvement</h2>
                  </div>
                </div>
                <div className="p-6">
                  {performanceData.weaknesses && performanceData.weaknesses.length > 0 ? (
                    <ul className="space-y-3">
                      {performanceData.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                            !
                          </div>
                          <span className="font-semibold text-slate-900">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-600 text-center py-4">No weaknesses identified yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Recent Submissions</h2>
                    <p className="text-xs text-slate-600">Latest task submissions</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {performanceData.recentSubmissions && performanceData.recentSubmissions.length > 0 ? (
                  <div className="space-y-3">
                    {performanceData.recentSubmissions.map((submission, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{submission.task}</p>
                            <p className="text-sm text-slate-600">{submission.submitted}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-indigo-600">{submission.marks}</p>
                          <p className="text-xs text-slate-500">marks</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-5xl">📭</span>
                    </div>
                    <p className="text-slate-600 font-semibold">No submissions yet</p>
                  </div>
                )}
              </div>
            </div>

          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md border border-slate-200">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">👤</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Select a Student</h3>
            <p className="text-slate-600">Choose a student from the dropdown to view their performance analytics</p>
          </div>
        )}

      </div>
    </div>
  );
}
