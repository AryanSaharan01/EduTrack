import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api.js";

export default function TeacherSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState([{ name: "", code: "", description: "" }]);
  const [loading, setLoading] = useState(false);

  const addSubject = () => {
    setSubjects([...subjects, { name: "", code: "", description: "" }]);
  };

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      const copy = subjects.filter((_, i) => i !== index);
      setSubjects(copy);
    }
  };

  const updateSubject = (index, key, value) => {
    const copy = [...subjects];
    copy[index][key] = value;
    setSubjects(copy);
  };

  const handleNext = () => {
    if (subjects.some(s => !s.name || !s.code)) {
      alert("Please fill all subject names and codes");
      return;
    }
    setStep(2);
  };

  const handleCompleteSetup = async () => {
    setLoading(true);
    try {
      // Filter out empty subjects and normalize data
      const payload = {
        subjects: subjects
          .map(s => ({ 
            name: s.name?.trim(), 
            code: s.code?.trim().toUpperCase(), 
            description: s.description?.trim() || null
          }))
          .filter(s => s.name && s.code)
      };

      if (payload.subjects.length === 0) {
        alert("Please add at least one subject with name & code.");
        setLoading(false);
        return;
      }

      const res = await api.post("/teacher/subjects", payload);
      
      // Log response for debugging
      console.log("Teacher Setup response:", res.data);

      // Check if any subjects already existed
      const existingSubjects = res.data.created?.filter(item => item.note === 'Subject code already exists');
      const newSubjects = res.data.created?.filter(item => !item.note);

      if (existingSubjects && existingSubjects.length > 0) {
        const existingCodes = existingSubjects.map(s => s.code).join(', ');
        alert(`Note: Subject codes ${existingCodes} already exist. Other subjects were created successfully.`);
      } else {
        alert(`Successfully created ${newSubjects?.length || 0} subject(s)!`);
      }

      // Redirect to Subject Management page
      navigate("/teacher/subjects");
    } catch (err) {
      console.error("Failed to create subjects:", err);
      const errorMessage = err.response?.data?.error || "Failed to save subjects. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">⚙️</span>
                <span>Initial Setup</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Teacher Setup
                </span>
              </h1>
              <p className="text-base text-slate-600">
                Configure your subjects and get started with teaching
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-4xl">🎯</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-slate-900">Step {step} of 2</span>
                <span className="text-xs text-slate-500">
                  {step === 1 ? "Add Subjects" : "Review & Confirm"}
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${(step / 2) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-bold text-indigo-600">{Math.round((step / 2) * 100)}%</span>
          </div>
        </div>

        {/* Step 1: Add Subjects */}
        {step === 1 && (
          <div className="space-y-5 animate-slide-up">
            
            {/* Instructions Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Add Your Subjects</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Enter the subjects you'll be teaching this semester. You can add multiple subjects and modify them later from your dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Subjects List */}
            <div className="space-y-4">
              {subjects.map((subject, i) => (
                <div 
                  key={i} 
                  className="group bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                      {i + 1}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Subject {i + 1}</h3>
                    {subjects.length > 1 && (
                      <button
                        onClick={() => removeSubject(i)}
                        className="ml-auto w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center"
                        title="Remove subject"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Subject Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Data Structures & Algorithms"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                        value={subject.name}
                        onChange={e => updateSubject(i, "name", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Subject Code
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., CS201"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium uppercase"
                        value={subject.code}
                        onChange={e => updateSubject(i, "code", e.target.value.toUpperCase())}
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        Description (Optional)
                      </label>
                      <textarea
                        placeholder="Brief description of the subject..."
                        rows="2"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 resize-none"
                        value={subject.description}
                        onChange={e => updateSubject(i, "description", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Button */}
            <button 
              onClick={addSubject} 
              className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-semibold px-6 py-4 rounded-xl hover:bg-slate-200 transition-all border-2 border-dashed border-slate-300 hover:border-slate-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Subject
            </button>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigate("/teacher/dashboard")}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-200 text-slate-700 font-semibold px-6 py-4 rounded-xl hover:bg-slate-300 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button 
                onClick={handleNext} 
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review & Confirm */}
        {step === 2 && (
          <div className="space-y-5 animate-slide-up">
            
            {/* Review Instructions */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Review Your Subjects</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Please review the subjects you've added. You can go back to make changes or proceed to complete the setup.
                  </p>
                </div>
              </div>
            </div>

            {/* Subjects Summary */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  Subjects Summary
                </h2>
                <p className="text-sm text-slate-600 mt-1">Total: {subjects.length} subject{subjects.length !== 1 ? 's' : ''}</p>
              </div>
              
              <div className="p-6 space-y-4">
                {subjects.map((subject, i) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{subject.name}</h3>
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">
                          {subject.code}
                        </span>
                      </div>
                      {subject.description && (
                        <p className="text-sm text-slate-600">{subject.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setStep(1)} 
                className="flex-1 flex items-center justify-center gap-2 bg-slate-200 text-slate-700 font-semibold px-6 py-4 rounded-xl hover:bg-slate-300 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button 
                onClick={handleCompleteSetup}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Complete Setup
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
