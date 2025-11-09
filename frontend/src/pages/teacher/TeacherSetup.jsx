import React, { useState } from "react";
import AppLink from "../../components/AppLink.jsx";

export default function TeacherSetup() {
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState([{ name: "", code: "" }]);

  const addSubject = () => setSubjects([...subjects, { name: "", code: "" }]);

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
    setStep(step + 1);
  };

  const handleSubmit = () => {
    // For demo, just alert
    alert("Setup complete. You'll be redirected to your dashboard.");
  };

  return (
    <div className="page max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Teacher Setup</h1>
      <p className="mb-8 text-gray-700 dark:text-gray-300">Step {step} of 2: Configure your subjects</p>

      {step === 1 && (
        <div className="space-y-4">
          {subjects.map((subject, i) => (
            <div key={i} className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Subject Name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={subject.name}
                onChange={e => updateSubject(i, "name", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Subject Code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={subject.code}
                onChange={e => updateSubject(i, "code", e.target.value)}
                required
              />
            </div>
          ))}
          <div className="flex flex-col gap-4">
            <button 
              onClick={addSubject} 
              className="btn-secondary w-full"
            >
              Add More Subjects
            </button>
            <button 
              onClick={handleNext} 
              className="btn-primary w-full"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <p className="text-gray-700 dark:text-gray-300">
            This step would handle course and section selection (demo placeholder).
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setStep(1)} 
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button 
              onClick={handleSubmit} 
              className="btn-primary flex-1"
            >
              Finish Setup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
