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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function StudentAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <div className="page text-center text-gray-600 dark:text-gray-400">Loading analytics...</div>;
  }

  if (error) {
    return <div className="page text-center text-red-600">{error}</div>;
  }

  if (!data) {
    return <div className="page text-center text-gray-600 dark:text-gray-400">No analytics data available.</div>;
  }

  return (
    <div className="page max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Your Performance Analytics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="card text-center">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Total Marks</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {data.totalMarks}
          </p>
        </div>
        <div className="card text-center">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Average Accuracy</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {data.accuracyPercent}%
          </p>
        </div>
        <div className="card text-center">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Tasks Completed</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {data.tasksCompleted}
          </p>
        </div>
      </div>

      <section className="card p-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Marks Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.markTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#718096" />
            <XAxis dataKey="date" tick={{ fill: '#718096' }} />
            <YAxis tick={{ fill: '#718096' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} />
            <Line type="monotone" dataKey="marks" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="card p-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Subject Distribution
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie 
              data={data.subjectDistribution} 
              dataKey="value" 
              nameKey="subject" 
              cx="50%" 
              cy="50%" 
              outerRadius={100}
              label
            >
              {data.subjectDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section className="card p-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Performance per Subject
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.performancePerSubject}>
            <CartesianGrid strokeDasharray="3 3" stroke="#718096" />
            <XAxis dataKey="subject" tick={{ fill: '#718096' }} />
            <YAxis tick={{ fill: '#718096' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} />
            <Bar dataKey="marks" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

