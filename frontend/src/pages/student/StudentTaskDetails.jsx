import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api.js";

export default function StudentTaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/student/tasks/${taskId}`)
      .then(res => {
        setTask(res.data.task);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load task details");
      })
      .finally(() => setLoading(false));
  }, [taskId]);

  const handleStartTest = () => {
    navigate(`/student/tasks/${taskId}/attempt`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl animate-spin mx-auto mb-4" 
               style={{ animationDuration: '3s' }} />
          <p className="text-slate-600 font-medium mt-3">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <p className="text-red-600 font-semibold mb-4">{error || "Task not found"}</p>
            <button
              onClick={() => navigate("/student/tasks")}
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
            >
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/student/tasks")}
          className="flex items-center gap-2 text-slate-600 hover:text-teal-600 font-medium transition-colors group mb-6"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tasks
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-50 to-white p-8 border-b border-slate-200">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">{task.title}</h1>
            <p className="text-base text-slate-600 leading-relaxed">{task.description || "Write a function to generate Fibonacci numbers"}</p>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-8 bg-slate-50">
            
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-500">Subject</p>
              </div>
              <p className="text-xl font-bold text-slate-900">{task.subject?.name || "Python Programming"}</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-500">Deadline</p>
              </div>
              <p className="text-xl font-bold text-slate-900">{new Date(task.deadline).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-500">Time Limit</p>
              </div>
              <p className="text-xl font-bold text-slate-900">{task.timeLimit || 45} minutes</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-500">Questions</p>
              </div>
              <p className="text-xl font-bold text-slate-900">{task.questionCount || 2} questions</p>
            </div>

          </div>

          {/* Important Instructions */}
          <div className="p-8">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Important Instructions</h3>
              </div>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">•</span>
                  <span className="text-base leading-relaxed">Do not switch tabs or minimize window (auto-submission will occur)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">•</span>
                  <span className="text-base leading-relaxed">Complete within the time limit</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">•</span>
                  <span className="text-base leading-relaxed">Test your code before final submission</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1">•</span>
                  <span className="text-base leading-relaxed">You cannot pause once started</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Start Test Button */}
          <div className="p-8 pt-0">
            <button
              onClick={handleStartTest}
              className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white text-lg font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              <span>Start Test</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}