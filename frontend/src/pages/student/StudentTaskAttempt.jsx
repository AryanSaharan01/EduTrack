import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api.js";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";

export default function StudentTaskAttempt() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [testOutput, setTestOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [socket, setSocket] = useState(null);
  
  const timerRef = useRef(null);

  // Fetch task and questions
  useEffect(() => {
    const fetchTask = async () => {
      try {
        console.log("Fetching task with ID:", taskId);
        
        const subjectsRes = await api.get("/student/subjects");
        console.log("Subjects response:", subjectsRes.data);
        
        const subjects = subjectsRes.data.subjects || [];
        
        let foundTask = null;
        for (const subject of subjects) {
          console.log(`Checking subject ${subject.id}...`);
          const subjectRes = await api.get(`/student/subjects/${subject.id}`);
          const tasks = subjectRes.data.tasks || [];
          
          console.log(`Tasks in subject ${subject.id}:`, tasks);
          
          foundTask = tasks.find(t => t.id === parseInt(taskId));
          if (foundTask) {
            console.log("✅ Task found:", foundTask);
            foundTask.subject = { id: subject.id, name: subject.name, code: subject.code };
            break;
          }
        }
        
        if (foundTask) {
          setTask(foundTask);
          const taskQuestions = foundTask.questions || [];
          console.log("✅ Questions loaded:", taskQuestions);
          setQuestions(taskQuestions);
          setTimeRemaining((foundTask.timeLimit || 45) * 60);
          
          // Initialize answers with starter code
          const initialAnswers = {};
          taskQuestions.forEach(q => {
            initialAnswers[q.id] = q.starterCode || `# Question ${q.questionNumber}\n# Write your code here\n\n`;
          });
          setAnswers(initialAnswers);
          console.log("✅ Initial answers set:", initialAnswers);
        } else {
          console.error("❌ Task not found with ID:", taskId);
        }
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching task:", err);
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  // Enter fullscreen when loaded
  useEffect(() => {
    if (!loading && task && questions.length > 0) {
      enterFullscreen();
    }
  }, [loading, task, questions]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && isFullscreen) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit("Time's up!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeRemaining, isFullscreen]);

  // Anti-cheating: Detect tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isFullscreen) {
        setTabSwitchCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            handleAutoSubmit("Too many tab switches detected!");
          } else {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
          }
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isFullscreen]);

  // Prevent right-click and keyboard shortcuts
  useEffect(() => {
    const preventActions = (e) => {
      if (e.type === "contextmenu") {
        e.preventDefault();
        return false;
      }
      
      if (e.ctrlKey || e.metaKey) {
        if (!["c", "v", "x", "a", "z"].includes(e.key.toLowerCase())) {
          e.preventDefault();
          return false;
        }
      }
      
      if (["F11", "F12"].includes(e.key)) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", preventActions);
    document.addEventListener("keydown", preventActions);
    
    return () => {
      document.removeEventListener("contextmenu", preventActions);
      document.removeEventListener("keydown", preventActions);
    };
  }, []);

  // Socket.IO connection for live preview
  useEffect(() => {
    // Get student ID from auth context (localStorage)
    const userStr = localStorage.getItem('user');
    if (!userStr || !task) return;
    
    const user = JSON.parse(userStr);
    const studentId = user.id;

    // Get socket URL from environment variables
    let socketUrl = import.meta.env.VITE_SOCKET_URL;
    
    // Fallback: derive from API URL if socket URL not set
    if (!socketUrl && import.meta.env.VITE_API_URL) {
      socketUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    }
    
    // Final fallback to localhost
    if (!socketUrl) {
      socketUrl = 'http://localhost:5000';
    }

    console.log('[STUDENT] Connecting to socket:', socketUrl);

    // Create socket connection
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('[STUDENT] Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[STUDENT] Socket connection error:', error.message);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('[STUDENT] Socket disconnected:', reason);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log('[STUDENT] Disconnecting socket');
      newSocket.disconnect();
    };
  }, [task]);

  // Emit student activity updates
  useEffect(() => {
    if (!socket || !task || questions.length === 0) return;

    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    
    const user = JSON.parse(userStr);
    const studentId = user.id;
    const currentQuestion = questions[currentQuestionIndex];
    
    if (!currentQuestion) return;

    const activityData = {
      studentId,
      taskId: parseInt(taskId),
      currentQuestion: currentQuestion.questionNumber,
      code: answers[currentQuestion.id] || '',
      status: 'active',
      timestamp: new Date().toISOString()
    };

    console.log('[STUDENT] Emitting student-update:', activityData);
    socket.emit('student-update', activityData);

  }, [socket, task, questions, currentQuestionIndex, answers, taskId]);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {
        console.log("Fullscreen error:", err);
        setIsFullscreen(true);
      });
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
      setIsFullscreen(true);
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  const handleAutoSubmit = async (reason) => {
    if (timerRef.current) clearInterval(timerRef.current);
    exitFullscreen();
    
    alert(`Test auto-submitted: ${reason}`);
    await handleSubmit(true);
  };

  const handleSubmit = async (isAuto = false) => {
    try {
      const submission = {
        taskId: parseInt(taskId),
        answers: Object.entries(answers).map(([questionId, code]) => ({
          questionId: parseInt(questionId),
          code: code
        })),
        tabSwitchCount,
        timeTaken: ((task.timeLimit || 45) * 60) - timeRemaining
      };

      console.log("Submitting:", submission);
      await api.post("/student/submissions", submission);
      
      exitFullscreen();
      navigate("/student/tasks", { 
        state: { message: isAuto ? "Test auto-submitted" : "Test submitted successfully" }
      });
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("Failed to submit test. Please try again.");
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setTestOutput("Running code...");
    
    const currentQuestion = questions[currentQuestionIndex];
    const code = answers[currentQuestion.id];
    
    try {
      const response = await api.post("/student/run-code", {
        code,
        language: currentQuestion.programmingLanguage || "python",
        expectedOutput: currentQuestion.expectedOutput
      });
      
      setTestOutput(response.data.output || "Code executed successfully");
    } catch (err) {
      setTestOutput(err.response?.data?.error || "Error running code");
    } finally {
      setIsRunning(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl animate-spin mx-auto mb-4" />
          <p className="text-white font-medium">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!task || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <p className="text-xl mb-2">Failed to load questions</p>
          <p className="text-slate-400 mb-6">No questions found for this task</p>
          <button 
            onClick={() => navigate("/student/tasks")} 
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="h-screen bg-slate-900 flex flex-col overflow-hidden">
      
      {/* Warning Banner */}
      {showWarning && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold">
            ⚠️ Warning: Tab switch detected! ({3 - tabSwitchCount} warnings left)
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">LIVE TEST</span>
          </div>
          <div className="h-6 w-px bg-slate-600"></div>
          <h2 className="text-white font-bold text-lg">{task.title}</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`font-mono font-bold text-lg ${timeRemaining < 300 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to submit? You cannot change your answers after submission.")) {
                handleSubmit(false);
              }
            }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold px-6 py-2 rounded-lg transition-all"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Question Panel */}
        <div className="w-1/3 bg-slate-800 border-r border-slate-700 flex flex-col">
          
          {/* Question Navigation */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex gap-2 flex-wrap">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    idx === currentQuestionIndex
                      ? 'bg-teal-500 text-white shadow-lg scale-110'
                      : answers[q.id] && answers[q.id].trim() !== (q.starterCode || "").trim()
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4">
              <span className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-lg text-sm font-semibold">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Question {currentQuestion.questionNumber}
            </h3>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
                {currentQuestion.questionText}
              </p>
            </div>

            {currentQuestion.marks && (
              <div className="mt-4">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-bold">
                  Marks: {currentQuestion.marks}
                </span>
              </div>
            )}

            {currentQuestion.expectedOutput && (
              <div className="mt-6">
                <h4 className="text-white font-bold mb-3">Expected Output:</h4>
                <div className="bg-slate-700 rounded-lg p-4">
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{currentQuestion.expectedOutput}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="flex-1 flex flex-col bg-slate-900">
          
          {/* Editor Header */}
          <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm font-medium">Code Editor</span>
              <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-mono">
                {currentQuestion.programmingLanguage || "python"}
              </span>
            </div>
            
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold px-4 py-2 rounded-lg transition-all"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Running...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Run Code
                </>
              )}
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={currentQuestion.programmingLanguage || "python"}
              theme="vs-dark"
              value={answers[currentQuestion.id] || ""}
              onChange={(value) => {
                setAnswers(prev => ({
                  ...prev,
                  [currentQuestion.id]: value
                }));
              }}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: "on"
              }}
            />
          </div>

          {/* Output Panel */}
          {testOutput && (
            <div className="h-48 bg-slate-800 border-t border-slate-700 p-4 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-slate-400 text-sm font-semibold">Output:</span>
              </div>
              <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{testOutput}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-slate-800 border-t border-slate-700 px-6 py-4 flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            {Object.keys(answers).filter(id => {
              const q = questions.find(q => q.id === parseInt(id));
              return answers[id].trim() !== (q?.starterCode || "").trim();
            }).length} answered
          </p>
        </div>

        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
          disabled={currentQuestionIndex === questions.length - 1}
          className="flex items-center gap-2 px-6 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-lg transition-all"
        >
          Next
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}