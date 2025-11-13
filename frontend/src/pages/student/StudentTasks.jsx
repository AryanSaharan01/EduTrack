import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api.js";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // First get subjects
        const subjectsRes = await api.get("/student/subjects");
        console.log("✅ Subjects response:", subjectsRes.data);
        
        const subjects = subjectsRes.data.subjects || subjectsRes.data || [];
        console.log("Subjects array:", subjects);
        
        if (!Array.isArray(subjects) || subjects.length === 0) {
          console.log("No subjects found");
          setTasks([]);
          setLoading(false);
          return;
        }

        // Now fetch each subject's tasks with questions
        const allTasks = [];
        
        for (const subject of subjects) {
          console.log(`Fetching tasks for subject ${subject.id}...`);
          
          try {
            const taskRes = await api.get(`/student/subjects/${subject.id}`);
            console.log(`✅ Full response for ${subject.name}:`, taskRes.data);
            
            const tasksArray = taskRes.data.tasks || [];
            console.log(`✅ Tasks with questions for ${subject.name}:`, tasksArray);
            
            if (Array.isArray(tasksArray) && tasksArray.length > 0) {
              tasksArray.forEach(task => {
                console.log(`✅ Task: ${task.title}, Questions: ${task.questions?.length || task.questionCount || 0}, Submitted: ${task.is_submitted}`);
                
                // Determine task status based on submission
                let taskStatus = task.status || 'published';
                if (task.is_submitted) {
                  taskStatus = 'completed';
                }
                
                allTasks.push({
                  id: task.id,
                  title: task.title,
                  description: task.description,
                  difficulty: task.difficulty || 'medium',
                  deadline: task.deadline,
                  timeLimit: task.timeLimit || 45,
                  status: taskStatus,
                  isSubmitted: task.is_submitted || false,
                  questionCount: task.questionCount || task.questions?.length || 0,
                  questions: task.questions || [],
                  subject: {
                    id: subject.id,
                    name: subject.name,
                    code: subject.code
                  }
                });
              });
            }
          } catch (err) {
            console.error(`❌ Error fetching tasks for subject ${subject.id}:`, err);
          }
        }
        
        console.log("✅✅ ALL TASKS WITH QUESTION COUNTS:", allTasks.map(t => ({ 
          title: t.title, 
          questions: t.questionCount 
        })));
        
        setTasks(allTasks);
        setLoading(false);
        
      } catch (err) {
        console.error("❌ Error loading data:", err);
        setError("Failed to load tasks. Please try again.");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "pending") return task.status === "published" || task.status === "pending";
    if (filter === "completed") return task.status === "graded" || task.status === "completed";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl animate-spin mx-auto mb-4" 
               style={{ animationDuration: '3s' }} />
          <p className="text-slate-600 font-medium mt-3">Loading your tasks...</p>
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
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
              >
                Retry
              </button>
              <button
                onClick={() => navigate("/student/dashboard")}
                className="bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-300 transition-all"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    easy: { gradient: "from-green-500 to-emerald-500", bg: "from-green-50 to-emerald-50", border: "border-green-200" },
    medium: { gradient: "from-yellow-500 to-orange-500", bg: "from-yellow-50 to-orange-50", border: "border-yellow-200" },
    hard: { gradient: "from-red-500 to-pink-500", bg: "from-red-50 to-pink-50", border: "border-red-200" }
  };

  const statusColors = {
    published: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
    draft: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft" },
    completed: { bg: "bg-blue-100", text: "text-blue-700", label: "Completed" },
    graded: { bg: "bg-purple-100", text: "text-purple-700", label: "Graded" }
  };

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">📝</span>
                <span>Lab Tasks</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Your Lab Tasks
                </span>
              </h1>
              <p className="text-base text-slate-600">
                Complete your programming assignments and coding challenges
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                <span className="text-4xl">💻</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200 flex gap-3 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
              filter === "pending"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Pending ({tasks.filter(t => t.status === 'published' || t.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
              filter === "completed"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Completed ({tasks.filter(t => t.status === 'completed' || t.status === 'graded').length})
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Completed</p>
                <p className="text-2xl font-bold text-slate-900">
                  {tasks.filter(t => t.status === 'completed' || t.status === 'graded').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending</p>
                <p className="text-2xl font-bold text-slate-900">
                  {tasks.filter(t => t.status === 'published' || t.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Success Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed' || t.status === 'graded').length / tasks.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 border border-slate-200 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {filter === "all" ? "No Tasks Available" : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks`}
            </h3>
            <p className="text-slate-600 mb-6">
              {tasks.length === 0 
                ? "No tasks have been assigned yet. Check back later for new assignments."
                : `You don't have any ${filter} tasks at the moment. Try changing the filter above.`
              }
            </p>
            <button 
              onClick={() => navigate("/student/dashboard")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => {
              const diffColor = difficultyColors[task.difficulty];
              const statusColor = statusColors[task.status];
              
              return (
                <div 
                  key={task.id} 
                  className="group bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-br ${diffColor.bg} border-b ${diffColor.border} p-6`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-14 h-14 bg-gradient-to-br ${diffColor.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                        <span className="text-3xl">💻</span>
                      </div>
                      <span className={`px-3 py-1 ${statusColor.bg} ${statusColor.text} rounded-lg text-xs font-bold shadow-sm`}>
                        {statusColor.label}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">
                      {task.title}
                    </h2>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {task.description || "Complete this programming assignment"}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="space-y-3 mb-5 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Subject
                        </span>
                        <span className="font-semibold text-slate-900">{task.subject.name}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Deadline
                        </span>
                        <span className="font-semibold text-slate-900">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Questions
                        </span>
                        <span className="font-semibold text-slate-900">{task.questionCount}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Difficulty
                        </span>
                        <span className={`font-bold ${diffColor.gradient} bg-gradient-to-r bg-clip-text text-transparent uppercase text-xs`}>
                          {task.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* View Details Button or Completed Badge */}
                    {task.isSubmitted ? (
                      <div className="w-full text-center bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-default">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completed ✓
                      </div>
                    ) : (
                      <button 
                        onClick={() => navigate(`/student/tasks/${task.id}`)}
                        className={`w-full text-center bg-gradient-to-r ${diffColor.gradient} text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2`}
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}