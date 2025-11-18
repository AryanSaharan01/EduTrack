import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";

export default function LivePreview() {
  const [socket, setSocket] = useState(null);
  const [activeStudents, setActiveStudents] = useState({});
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedCode, setSelectedCode] = useState("");
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("connecting");

  useEffect(() => {
    // Use VITE_SOCKET_URL if available, otherwise derive from VITE_API_URL
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 
                      import.meta.env.VITE_API_URL?.replace('/api', '') || 
                      "http://localhost:5000";
    
    console.log("🔌 Connecting to Socket.IO:", socketUrl);
    
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket.IO connected:", newSocket.id);
      setSocket(newSocket);
      setConnectionStatus("connected");
      setError(null);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      setError(`Failed to connect to server at ${socketUrl}`);
      setConnectionStatus("disconnected");
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 Socket.IO disconnected");
      setConnectionStatus("disconnected");
    });

    newSocket.on("active-students-update", (data) => {
      console.log("📊 [LIVE PREVIEW] Active students update received:", data);
      console.log("📊 [LIVE PREVIEW] Number of students:", Object.keys(data).length);
      
      // Log each student's details
      Object.entries(data).forEach(([socketId, student]) => {
        console.log(`👤 [LIVE PREVIEW] Student ${socketId}:`, {
          studentId: student.studentId,
          studentName: student.studentName,
          rollNo: student.rollNo,
          section: student.section,
          taskTitle: student.taskTitle
        });
      });
      
      setActiveStudents(data);
    });

    return () => {
      console.log("🔌 Cleaning up socket connection");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedStudentId && activeStudents[selectedStudentId]) {
      const student = activeStudents[selectedStudentId];
      setSelectedCode(student.code || `// No code available yet from ${student.studentName || 'student'}`);
    } else {
      setSelectedCode("");
    }
  }, [selectedStudentId, activeStudents]);

  if (error && connectionStatus === "disconnected") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connection Failed</h2>
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  const studentCount = Object.keys(activeStudents).length;
  const attemptingCount = Object.values(activeStudents).filter(s => s.status === "attempting").length;
  const submittedCount = Object.values(activeStudents).filter(s => s.status === "submitted").length;

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="px-8 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">👁️</span>
                <span>Live Monitoring</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Student Activity Monitor
                </span>
              </h1>
              <p className="text-base text-slate-600">
                Real-time view of student code and progress
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                connectionStatus === "connected" 
                  ? "bg-green-100 text-green-700" 
                  : connectionStatus === "connecting"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === "connected" 
                    ? "bg-green-500 animate-pulse" 
                    : connectionStatus === "connecting"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                }`} />
                <span className="text-sm font-semibold capitalize">{connectionStatus}</span>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                <span className="text-4xl">📡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Active Students</p>
                <p className="text-2xl font-bold text-slate-900">{studentCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Attempting</p>
                <p className="text-2xl font-bold text-slate-900">{attemptingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Submitted</p>
                <p className="text-2xl font-bold text-slate-900">{submittedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active Students List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden h-[calc(100vh-8rem)]">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">👨‍💻</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Active Students</h2>
                      <p className="text-xs text-slate-600">{studentCount} online</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold">
                    Live
                  </span>
                </div>
              </div>

              <div className="p-4 overflow-y-auto h-full">
                {Object.keys(activeStudents).length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4">
                      <span className="text-5xl">💤</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Students</h3>
                    <p className="text-sm text-slate-600">
                      Students will appear here when they start attempting tasks
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {Object.entries(activeStudents).map(([socketId, s]) => {
                      const statusColors = {
                        attempting: { bg: "from-green-50 to-emerald-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100" },
                        submitted: { bg: "from-blue-50 to-cyan-50", border: "border-blue-200", text: "text-blue-700", badge: "bg-blue-100" },
                        idle: { bg: "from-slate-50 to-slate-100", border: "border-slate-200", text: "text-slate-700", badge: "bg-slate-100" }
                      };
                      const colors = statusColors[s.status] || statusColors.idle;

                      return (
                        <li
                          key={socketId}
                          className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                            socketId === selectedStudentId
                              ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 shadow-md scale-105"
                              : `bg-gradient-to-br ${colors.bg} ${colors.border} hover:shadow-md hover:scale-102`
                          }`}
                          onClick={() => setSelectedStudentId(socketId)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                {s.studentName?.substring(0, 2).toUpperCase() || s.rollNo?.substring(0, 2) || "S"}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-900 text-sm">
                                  {s.studentName || `Student ${s.studentId}`}
                                </span>
                                {s.rollNo && (
                                  <span className="text-xs text-slate-500">
                                    {s.rollNo} {s.section ? `• ${s.section}` : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className={`px-2 py-1 ${colors.badge} ${colors.text} rounded-lg text-xs font-bold capitalize`}>
                              {s.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 space-y-1">
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              <span>Task: <span className="font-semibold">{s.taskTitle || s.taskId}</span></span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Question: <span className="font-semibold">{s.currentQuestion || '...'}</span></span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Code Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden h-[calc(100vh-8rem)]">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">💻</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Live Code Preview</h2>
                      <p className="text-xs text-slate-600">
                        {selectedStudentId 
                          ? `Viewing ${activeStudents[selectedStudentId]?.studentName || activeStudents[selectedStudentId]?.studentId}'s code`
                          : "Select a student to view their code"
                        }
                      </p>
                    </div>
                  </div>
                  {selectedCode && (
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-auto h-full">
                {selectedCode ? (
                  <Editor
                    height="100%"
                    defaultLanguage="python"
                    value={selectedCode}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center bg-slate-900 p-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mb-4">
                      <span className="text-5xl">🖥️</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-2">No Student Selected</h3>
                    <p className="text-slate-400 max-w-md">
                      Select a student from the list to view their code in real-time
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}