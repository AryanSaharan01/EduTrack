import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MonacoEditor from "react-monaco-editor";
import api from "../../utils/api.js";

const PROGRAMMING_LANGUAGES = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
  csharp: "C#"
};

export default function TaskAttempt() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedQIndex, setSelectedQIndex] = useState(0);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get(`/tasks/${taskId}`)
      .then(res => {
        setQuestions(res.data.questions);
        if (res.data.questions.length > 0) {
          const firstLang = res.data.questions[0].programming_language;
          setLanguage(firstLang);
          setCode("");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load task questions");
      })
      .finally(() => setLoading(false));
  }, [taskId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);

    try {
      const answers = questions.map(q => ({
        questionId: q.id,
        code: code,
        expectedOutput: q.expected_output,
        marks: q.marks
      }));

      const res = await api.post("/tasks/submit", { 
        taskId: Number(taskId), 
        answers 
      });

      setResult(res.data.success ? 
        "Submission successful!" : 
        "Submission failed. Please check your code and try again."
      );
    } catch (err) {
      console.error(err);
      setResult("Submission failed due to network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page text-center text-gray-600 dark:text-gray-400">Loading task questions...</div>;
  }

  if (error) {
    return <div className="page text-center text-red-600">{error}</div>;
  }

  if (questions.length === 0) {
    return <div className="page text-center text-red-600">No questions found for this task.</div>;
  }

  return (
    <div className="page max-w-5xl mx-auto flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-1/4 bg-white dark:bg-gray-900 rounded-lg shadow p-4">
        <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Questions</h3>
        <nav className="space-y-2">
          {questions.map((q, i) => (
            <button
              key={q.id}
              className={`block w-full text-left p-2 rounded transition-colors
                ${selectedQIndex === i 
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              onClick={() => {
                setSelectedQIndex(i);
                setLanguage(questions[i].programming_language);
                setCode("");
                setResult(null);
              }}
            >
              Question {q.question_number}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col space-y-4">
        <div className="flex space-x-2 items-center">
          <label className="font-semibold text-gray-900 dark:text-white">Language:</label>
          <select 
            className="input bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            {Object.entries(PROGRAMMING_LANGUAGES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <MonacoEditor
          width="100%"
          height="400"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={setCode}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false
          }}
        />

        <button 
          onClick={handleSubmit} 
          disabled={submitting || !code}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Answer"}
        </button>

        {result && (
          <p className={`text-center p-2 rounded ${
            result.includes("successful") 
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}>
            {result}
          </p>
        )}
      </main>
    </div>
  );
}