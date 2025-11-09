import React, { useState, useEffect } from "react";
import api from "../../utils/api.js";
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
  ResponsiveContainer 
} from "recharts";

export default function StudentPerformance() {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/teacher/students")
      .then(res => setStudents(res.data.students))
      .catch(err => {
        console.error(err);
        setError("Failed to load students");
      });
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;
    setLoading(true);
    setError(null);
    
    api.get(`/performance/student/${selectedStudentId}`)
      .then(res => setPerformanceData(res.data.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load performance data");
      })
      .finally(() => setLoading(false));
  }, [selectedStudentId]);

  if (error) {
    return (
      <div className="page flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="page max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Student Performance Analytics
      </h1>
      
      <select
        className="input w-full md:w-auto mb-4"
        value={selectedStudentId || ""}
        onChange={(e) => setSelectedStudentId(e.target.value)}
      >
        <option value="">Select Student</option>
        {students.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      {loading && (
        <div className="flex justify-center">
          <p className="text-gray-600 dark:text-gray-400">Loading performance data...</p>
        </div>
      )}

      {!loading && performanceData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Average Marks</h3>
              <p className="text-4xl text-indigo-600 dark:text-indigo-400">
                {performanceData.average_marks.toFixed(2)}
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Accuracy</h3>
              <p className="text-4xl text-indigo-600 dark:text-indigo-400">
                {performanceData.average_accuracy.toFixed(2)}%
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Completed Tasks</h3>
              <p className="text-4xl text-indigo-600 dark:text-indigo-400">
                {performanceData.completed_tasks}
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Total Tasks</h3>
              <p className="text-4xl text-indigo-600 dark:text-indigo-400">
                {performanceData.total_tasks}
              </p>
            </div>
          </div>

          <section className="card">
            <h2 className="font-semibold text-2xl mb-3 text-gray-900 dark:text-white">
              Task Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData.tasks || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="taskName" tick={{ fill: '#718096' }} />
                <YAxis tick={{ fill: '#718096' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a202c',
                    border: 'none',
                    borderRadius: '0.375rem'
                  }}
                />
                <Legend />
                <Bar dataKey="marks" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="card">
            <h2 className="font-semibold text-2xl mb-3 text-gray-900 dark:text-white">
              Improvement Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData.trend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <Line 
                  type="monotone" 
                  dataKey="marks" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                />
                <XAxis dataKey="date" tick={{ fill: '#718096' }} />
                <YAxis tick={{ fill: '#718096' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a202c',
                    border: 'none',
                    borderRadius: '0.375rem'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
        </>
      )}
    </div>
  );
}
