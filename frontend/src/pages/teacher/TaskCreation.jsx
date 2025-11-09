import React, { useState, useEffect } from "react";
import api from "../../utils/api.js";
import AppLink from "../../components/AppLink.jsx";
import { PROGRAMMING_LANGUAGES, DIFFICULTY } from "../../utils/constants.js";

export default function TaskCreation() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [timeLimit, setTimeLimit] = useState(60);
    const [deadline, setDeadline] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [courseId, setCourseId] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [questions, setQuestions] = useState([
        { text: "", language: "python", expectedOutput: "", marks: 25 }
    ]);
    const [subjects, setSubjects] = useState([]);
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/teacher/subjects")
            .then(res => setSubjects(res.data.subjects))
            .catch(() => setSubjects([]));
    }, []);

    useEffect(() => {
        if (!subjectId) return setCourses([]);
        api.get(`/teacher/subjects/${subjectId}`)
            .then(res => setCourses(res.data.courses))
            .catch(() => setCourses([]));
    }, [subjectId]);

    useEffect(() => {
        if (!courseId) return setSections([]);
        api.get(`/teacher/courses/${courseId}/sections`)
            .then(res => setSections(res.data.sections))
            .catch(() => setSections([]));
    }, [courseId]);

    const addQuestion = () => setQuestions([
        ...questions,
        {
            text: "",
            language: "python",
            expectedOutput: "",
            marks: 25
        }
    ]);

    const updateQuestion = (idx, key, value) => {
        const newQs = [...questions];
        newQs[idx][key] = value;
        setQuestions(newQs);
    };

    const removeQuestion = (idx) => {
        if (questions.length === 1) return;
        setQuestions(questions.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !subjectId || !courseId || !sectionId ||
            questions.some(q => !q.text || !q.expectedOutput)) {
            alert("Please fill all required fields and question data.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/tasks/create", {
                title,
                description,
                difficulty,
                timeLimit,
                deadline,
                courseId,
                sectionId,
                questions
            });
            alert("Task created successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to create task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Create New Lab Task</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block font-semibold mb-1">Task Title *</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input" required />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Difficulty</label>
                        <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            {DIFFICULTY.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Time Limit (mins)</label>
                        <input type="number" min="1" max="180" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="input" />
                    </div>
                </section>
                <section>
                    <label className="block font-semibold mb-1">Task Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input w-full" rows={4}></textarea>
                </section>
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block font-semibold mb-1">Subject *</label>
                        <select value={subjectId} onChange={e => setSubjectId(e.target.value)} required className="input">
                            <option value="">Select subject</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Course *</label>
                        <select value={courseId} onChange={e => setCourseId(e.target.value)} required className="input">
                            <option value="">Select course</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Section *</label>
                        <select value={sectionId} onChange={e => setSectionId(e.target.value)} required className="input">
                            <option value="">Select section</option>
                            {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </section>
                <section>
                    <label className="font-semibold block mb-2 text-gray-900 dark:text-white">Questions *</label>
                    {questions.map((q, i) => (
                        <div key={i} className="card mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Question {i + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(i)}
                                    disabled={questions.length === 1}
                                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                >
                                    Remove
                                </button>
                            </div>

                            <textarea
                                value={q.text}
                                onChange={e => updateQuestion(i, "text", e.target.value)}
                                placeholder="Question text..."
                                rows={3}
                                className="input w-full mb-3"
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <select
                                    className="input"
                                    value={q.language}
                                    onChange={e => updateQuestion(i, "language", e.target.value)}
                                >
                                    {PROGRAMMING_LANGUAGES.map(l => (
                                        <option key={l} value={l}>
                                            {l.charAt(0).toUpperCase() + l.slice(1)}
                                        </option>
                                    ))}
                                </select>

                                <textarea
                                    value={q.expectedOutput}
                                    onChange={e => updateQuestion(i, "expectedOutput", e.target.value)}
                                    placeholder="Expected output"
                                    rows={1}
                                    className="input"
                                    required
                                />

                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={q.marks}
                                    onChange={e => updateQuestion(i, "marks", Number(e.target.value))}
                                    className="input"
                                    placeholder="Marks"
                                    required
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="btn-secondary w-full"
                    >
                        Add Question
                    </button>
                </section>

                <div className="flex justify-end space-x-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? "Saving..." : "Publish Task"}
                    </button>
                </div>
            </form>
        </div>
    );
}