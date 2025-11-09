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
    const fetchTaskDetails = async () => {
      try {
        console.log("Fetching task details for ID:", taskId);
        
        // Get all subjects first
        const subjectsRes = await api.get("/student/subjects");
        const subjects = subjectsRes.data.subjects || [];
        
        let foundTask = null;
        
        // Search through each subject to find the task
        for (const subject of subjects) {
          const subjectRes = await api.get(`/student/subjects/${subject.id}`);
          const tasks = subjectRes.data.tasks || [];
          
          foundTask = tasks.find(t => t.id === parseInt(taskId));
          
          if (foundTask) {
            console.log("Task found:", foundTask);
            // Add subject info
            foundTask.subject = {
              id: subject.id,
              name: subject.name,
              code: subject.code
            };
            break;
          }
        }
        
        if (foundTask) {
          setTask(foundTask);
        } else {
          setError("Task not found");
        }
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleStartTest = () => {
    console.log("Starting test for task:", taskId);
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

  const difficultyColors = {
    easy: "from-green-500 to-emerald-500",
    medium: "from-yellow-500 to-orange-500",
    hard: "from-red-500 to-pink-500"
  };

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
          <div className={`bg-gradient-to-br ${difficultyColors[task.difficulty || 'medium']} p-8`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-bold">
                {task.subject?.name || "Programming"}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-bold uppercase">
                {task.difficulty || "Medium"}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">{task.title}</h1>
            <p className="text-lg text-white/90 leading-relaxed">{task.description || "Complete this programming assignment"}</p>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-8 bg-slate-50">
            
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-500">Subject</p>
              </div>
              <p className="text-xl font-bold text-slate-900">{task.subject?.name}</p>
              <p className="text-sm text-slate-500 mt-1">{task.subject?.code}</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-500">Deadline</p>
              </div>
              <p className="text-xl font-bold text-slate-900">
                {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }) : "No deadline"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
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

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-500">Questions</p>
              </div>
              <p className="text-xl font-bold text-slate-900">{task.questionCount || task.questions?.length || 0} questions</p>
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
                  <span className="text-orange-600 mt-1 text-xl">•</span>
                  <span className="text-base leading-relaxed">
                    <strong>Do not switch tabs or minimize window</strong> - Auto-submission will occur if you leave the test page
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1 text-xl">•</span>
                  <span className="text-base leading-relaxed">
                    <strong>Complete within the time limit</strong> - Test will auto-submit when time expires
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1 text-xl">•</span>
                  <span className="text-base leading-relaxed">
                    <strong>Test your code before submission</strong> - Use the "Run Code" button to verify
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1 text-xl">•</span>
                  <span className="text-base leading-relaxed">
                    <strong>Cannot pause once started</strong> - Make sure you have uninterrupted time
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 mt-1 text-xl">•</span>
                  <span className="text-base leading-relaxed">
                    <strong>Fullscreen mode required</strong> - Test will run in fullscreen for security
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Start Test Button */}
          <div className="p-8 pt-0">
            <button
              onClick={handleStartTest}
              className={`w-full bg-gradient-to-r ${difficultyColors[task.difficulty || 'medium']} hover:shadow-2xl text-white text-lg font-bold py-5 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start Test Now</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <p className="text-center text-sm text-slate-500 mt-4">
              By clicking "Start Test Now", you agree to the anti-cheating policies
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}