import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api.js";
import Editor from "@monaco-editor/react";

export default function SubmissionGrading() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubmission();
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/teacher/submissions/${submissionId}`);
      setSubmission(response.data.submission);
      
      // Initialize marks state
      const initialMarks = {};
      response.data.submission.answers.forEach(answer => {
        initialMarks[answer.answer_id] = answer.marks_awarded || 0;
      });
      setMarks(initialMarks);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching submission:", err);
      setError("Failed to load submission details");
      setLoading(false);
    }
  };

  const handleMarkChange = (answerId, value) => {
    setMarks(prev => ({
      ...prev,
      [answerId]: parseInt(value) || 0
    }));
  };

  const handleSubmitGrades = async () => {
    try {
      setGrading(true);
      
      const answers = Object.entries(marks).map(([answerId, marksAwarded]) => ({
        answerId: parseInt(answerId),
        marksAwarded: marksAwarded
      }));

      await api.put(`/teacher/submissions/${submissionId}/grade`, { answers });
      
      alert("Grades submitted successfully!");
      navigate(`/teacher/tasks/${submission.task_id}/submissions`);
    } catch (err) {
      console.error("Error submitting grades:", err);
      alert("Failed to submit grades. Please try again.");
    } finally {
      setGrading(false);
    }
  };

  const getTotalMarks = () => {
    return Object.values(marks).reduce((sum, mark) => sum + mark, 0);
  };

  const getMaxMarks = () => {
    // Each question is worth 5 marks
    return (submission?.answers.length || 0) * 5;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <p className="text-red-600 font-semibold mb-4">{error || "Submission not found"}</p>
            <button
              onClick={() => navigate("/teacher/tasks")}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
            >
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isGraded = submission.submission_status === 'graded';

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="px-8 py-6 space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200">
          <button
            onClick={() => navigate(`/teacher/tasks/${submission.task_id}/submissions`)}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Submissions
          </button>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">📝</span>
                <span>Submission Review</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{submission.task_title}</h1>
              <p className="text-base text-slate-600">
                Student: <strong>{submission.student_name}</strong> ({submission.roll_no})
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Submitted: {new Date(submission.submitted_at).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                <p className="text-sm text-slate-600 mb-1">Total Marks</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {getTotalMarks()} / {getMaxMarks()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="space-y-6">
          {submission.answers.map((answer, index) => (
            <div key={answer.answer_id} className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              
              {/* Question Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                      {answer.question_number}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Question {answer.question_number}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">
                    {answer.programming_language}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{answer.question_text}</p>
              </div>

              {/* Code Editor */}
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Student's Answer:
                  </label>
                  <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                    <Editor
                      height="300px"
                      language={answer.programming_language || "python"}
                      theme="vs-dark"
                      value={answer.answer_code || "// No code submitted"}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14
                      }}
                    />
                  </div>
                </div>

                {/* Expected Output */}
                {answer.expected_output && (
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Expected Output:
                    </label>
                    <div className="bg-slate-100 border-2 border-slate-200 rounded-xl p-4">
                      <pre className="text-sm font-mono text-slate-900 whitespace-pre-wrap">
                        {answer.expected_output}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Grading */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-slate-700">
                      Award Marks:
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-600 font-medium">Select:</span>
                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2, 3, 4, 5].map((mark) => (
                          <button
                            key={mark}
                            type="button"
                            onClick={() => handleMarkChange(answer.answer_id, mark)}
                            disabled={isGraded}
                            className={`
                              w-10 h-10 rounded-lg font-bold text-sm transition-all
                              ${marks[answer.answer_id] === mark
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg scale-110 ring-2 ring-indigo-300'
                                : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-indigo-400 hover:shadow-sm hover:scale-105'
                              }
                              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                            `}
                          >
                            {mark}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-indigo-200">
                    <span className="text-sm font-medium text-slate-600">Marks Awarded:</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-indigo-600">
                          {marks[answer.answer_id] || 0}
                        </span>
                        <span className="text-base text-slate-500 font-medium">/ 5</span>
                      </div>
                      <div className="h-6 w-px bg-slate-300"></div>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-bold">
                        {((marks[answer.answer_id] || 0) / 5 * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        {!isGraded && (
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-md border border-slate-200 p-6">
            <div>
              <p className="text-lg font-bold text-slate-900">
                Total: {getTotalMarks()} / {getMaxMarks()} marks
              </p>
              <p className="text-sm text-slate-600">
                Percentage: {getMaxMarks() > 0 ? ((getTotalMarks() / getMaxMarks()) * 100).toFixed(2) : 0}%
              </p>
            </div>
            <button
              onClick={handleSubmitGrades}
              disabled={grading}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition-all disabled:cursor-not-allowed"
            >
              {grading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Grades
                </>
              )}
            </button>
          </div>
        )}

        {isGraded && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-bold text-green-900">This submission has already been graded</p>
            <p className="text-sm text-green-700 mt-1">Final Score: {submission.total_marks_obtained} / {getMaxMarks()}</p>
          </div>
        )}

      </div>
    </div>
  );
}
