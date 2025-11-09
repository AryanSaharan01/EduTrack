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

  useEffect(() => {
    api.get("/teacher/dashboard")
      .then(res => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page text-center">Loading...</div>;
  if (!data) return <div className="page text-center text-red-600">Failed to load dashboard data</div>;

  return (
    <div className="page space-y-8">
      <h1 className="text-3xl font-bold">Hello, Teacher!</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card text-center">
          <h2 className="text-lg font-semibold">Total Subjects</h2>
          <p className="text-4xl font-bold">{data.totalSubjects}</p>
          <AppLink to="/teacher/subjects" className="text-indigo-600 mt-2 inline-block">View All</AppLink>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-semibold">Total Students</h2>
          <p className="text-4xl font-bold">{data.totalStudents}</p>
          <AppLink to="/teacher/students" className="text-indigo-600 mt-2 inline-block">View All</AppLink>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-semibold">Pending Lab Tasks</h2>
          <p className="text-4xl font-bold">{data.pendingTasks}</p>
          <AppLink to="/teacher/tasks/create" className="text-indigo-600 mt-2 inline-block">Create New</AppLink>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-semibold">Avg. Class Performance</h2>
          <p className="text-4xl font-bold">{data.avgPerformance}%</p>
          <AppLink to="/teacher/class-analytics" className="text-indigo-600 mt-2 inline-block">View Analytics</AppLink>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-semibold">Last Notification Sent</h2>
          <p className="text-sm">{new Date(data.lastNotification).toLocaleString()}</p>
          <AppLink to="/teacher/notifications" className="text-indigo-600 mt-2 inline-block">Send New</AppLink>
        </div>
      </div>

      <section>
        <h2 className="font-semibold text-2xl mb-3">Performance Trend (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.performanceTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <Line type="monotone" dataKey="marks" stroke="#4f46e5" strokeWidth={3} />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="day" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="flex gap-4">
        <AppLink to="/teacher/tasks/create" className="btn-primary flex-1">Create Task</AppLink>
        <AppLink to="/teacher/notifications" className="btn-secondary flex-1">Send Notification</AppLink>
        <AppLink to="/teacher/live-preview" className="btn-secondary flex-1">View Live Session</AppLink>
      </section>

      <section>
        <h2 className="font-semibold text-2xl mb-3">Recent Activities</h2>
        <table className="w-full table-auto border border-gray-300 rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 border">Student</th>
              <th className="p-3 border">Task</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">View</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">Alice Cooper</td>
              <td className="p-2 border">Fibonacci Sequence</td>
              <td className="p-2 border">Nov 4, 2025</td>
              <td className="p-2 border text-green-600 font-semibold">Submitted</td>
              <td className="p-2 border">
                <AppLink to="/teacher/tasks/1/submissions" className="text-indigo-600 hover:text-indigo-800">
                  View Details
                </AppLink>
              </td>
            </tr>
            {/* More rows as needed */}
          </tbody>
        </table>
      </section>
    </div>
  );
}