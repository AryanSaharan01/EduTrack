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
  CartesianGrid 
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function ClassAnalytics() {
  const [filter, setFilter] = useState({
    subject: "",
    course: "",
    section: ""
  });
  const [classStats, setClassStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filter.subject) return;
    setLoading(true);
    setError(null);
    
    api.get(`/performance/class/${filter.subject}`)
      .then(res => setClassStats(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load class analytics");
      })
      .finally(() => setLoading(false));
  }, [filter.subject]);

  if (error) {
    return (
      <div className="page flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="page max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Class Analytics</h1>
      
      <div className="flex space-x-4 max-w-md">
        <select
          value={filter.subject}
          onChange={e => setFilter({ ...filter, subject: e.target.value })}
          className="input flex-1"
        >
          <option value="">Select Subject</option>
          <option value="1">Python Programming</option>
          <option value="2">Web Development</option>
          <option value="3">Data Structures</option>
        </select>
      </div>

      {loading && (
        <div className="flex justify-center">
          <p className="text-gray-600 dark:text-gray-400">Loading class analytics...</p>
        </div>
      )}

      {classStats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="card text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Class Average</h3>
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {classStats.classAverage?.toFixed(2)}
              </p>
            </div>
            <div className="card text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Topper</h3>
              <p className="text-gray-700 dark:text-gray-300">{classStats.topper?.name || "-"}</p>
            </div>
            <div className="card text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Lowest Performer</h3>
              <p className="text-gray-700 dark:text-gray-300">{classStats.lowestPerformer?.name || "-"}</p>
            </div>
            <div className="card text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Task Difficulty Index</h3>
              <p className="text-gray-700 dark:text-gray-300">{classStats.taskDifficultyIndex || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="card p-4">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Completion Rate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={classStats.completionRate}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {classStats.completionRate?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-4">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Performance Matrix</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={classStats.performanceMatrix}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#718096" />
                  <XAxis dataKey="task" tick={{ fill: '#718096' }} />
                  <YAxis tick={{ fill: '#718096' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a202c',
                      border: 'none',
                      borderRadius: '0.375rem'
                    }}
                  />
                  <Bar dataKey="averageMarks" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


