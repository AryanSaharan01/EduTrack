import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api.js";
import AppLink from "../../components/AppLink.jsx";

export default function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/tasks/${taskId}`)
      .then(res => {
        setTask(res.data.task);
        setQuestions(res.data.questions);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load task details");
      })
      .finally(() => setLoading(false));
  }, [taskId]);

  if (loading) {
    return <div className="page text-center text-gray-600 dark:text-gray-400">Loading task details...</div>;
  }

  if (error) {
    return <div className="page text-center text-red-600">{error}</div>;
  }

  if (!task) {
    return <div className="page text-center text-red-600">Task not found.</div>;
  }

  return (
    <div className="page max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {task.title}
      </h1>

      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
        
        <p className="text-gray-700 dark:text-gray-300">
          Difficulty: {task.difficulty_level}
        </p>
        
        <p className="text-gray-700 dark:text-gray-300">
          Deadline: {task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}
        </p>
      </div>

      <section>
        <h2 className="font-semibold text-2xl mb-4 text-gray-900 dark:text-white">
          Questions
        </h2>
        <ul className="space-y-4">
          {questions.map(q => (
            <li 
              key={q.id} 
              className="card p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Question {q.question_number}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 my-2">
                {q.question_text}
              </p>
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                <p>
                  <strong className="text-gray-900 dark:text-white">Language: </strong>
                  {q.programming_language}
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">Expected Output: </strong>
                  {q.expected_output}
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">Marks: </strong>
                  {q.marks}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <AppLink 
        to={`/student/tasks/${taskId}/attempt`} 
        className="btn-primary inline-block"
      >
        Attempt Task
      </AppLink>
    </div>
  );
}