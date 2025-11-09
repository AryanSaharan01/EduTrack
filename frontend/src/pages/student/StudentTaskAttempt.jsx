import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api.js";

export default function StudentTaskAttempt() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);

  // Anti-cheating: Track visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            handleAutoSubmit("Tab switch detected");
          } else {
            alert(`Warning ${newCount}/2: Do not switch tabs! Next violation will auto-submit.`);
          }
          return newCount;
        });
      }
    };

    const handleBlur = () => {
      setWarningCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 2) {
          handleAutoSubmit("Window minimized detected");
        } else {
          alert(`Warning ${newCount}/2: Stay focused! Next violation will auto-submit.`);
        }
        return newCount;
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Could not enter fullscreen:", err);
      });
    }

    // Prevent right-click
    const preventRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", preventRightClick);

    // Prevent F12, Ctrl+Shift+I, etc.
    const preventDevTools = (e) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U
      ) {
        e.preventDefault();
        return false;
      }
    };
    document.addEventListener("keydown", preventDevTools);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("contextmenu", preventRightClick);
      document.removeEventListener("keydown", preventDevTools);
      
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error(err));
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Load task data
  useEffect(() => {
    api.get(`/student/tasks/${taskId}/attempt`)
      .then(res => {
        setTask(res.data.task);
        setQuestions(res.data.questions || []);
        setTimeRemaining((res.data.task.timeLimit || 45) * 60); // Convert to seconds
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load task");
        navigate("/student/tasks");
      });
  }, [taskId, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit("Time expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining]);

  const handleAutoSubmit = async (reason) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await api.post(`/student/tasks/${taskId}/submit`, {
        answers,
        autoSubmit: true,
        reason,
        score: 0
      });
      
      alert(`Test auto-submitted: ${reason}. Score: 0`);
      navigate("/student/tasks");
    } catch (error) {
      console.error("Auto-submit failed:", error);
    }
  };

  const handleManualSubmit = async () => {
    if (isSubmitting) return;
    
    const confirmed = window.confirm("Are you sure you want to submit? You cannot change answers after submission.");
    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const response = await api.post(`/student/tasks/${taskId}/submit`, {
        answers,
        autoSubmit: false
      });
      
      alert(`Test submitted successfully! Score: ${response.data.score}/${response.data.totalScore}`);
      navigate("/student/tasks");
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Failed to submit. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-medium">Loading test...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      
      {/* Header with Timer */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{task.title}</h1>
            <p className="text-sm text-slate-400">Questions: {questions.length} | Warnings: {warningCount}/2</p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Timer */}
            <div className="flex items-center gap-3 bg-slate-700 px-6 py-3 rounded-xl border border-slate-600">
              <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs text-slate-400">Time Remaining</p>
                <p className={`text-2xl font-bold ${timeRemaining < 300 ? 'text-red-400' : 'text-teal-400'}`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Test"}
            </button>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {warningCount > 0 && (
        <div className="bg-red-900 border-b border-red-700 px-6 py-3">
          <p className="text-center text-red-200 font-semibold">
            ⚠️ Warning: {warningCount}/2 violations detected. One more violation will auto-submit with 0 marks!
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{question.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{question.description}</p>
                  {question.marks && (
                    <p className="text-sm text-teal-400 mt-2">Marks: {question.marks}</p>
                  )}
                </div>
              </div>

              {/* Answer Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-3">Your Answer:</label>
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Write your code here..."
                  rows={12}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  spellCheck="false"
                />
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                  <span>{(answers[question.id] || "").length} characters</span>
                  <span className="text-slate-600">Ctrl+Enter to format</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Submit */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleManualSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white text-lg font-bold px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </div>

    </div>
  );
}