import React, { useState, useEffect } from "react";
import api from "../../utils/api.js";
import { Link } from "react-router-dom";
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
    const [mySubjects, setMySubjects] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load teacher's assigned subjects
    useEffect(() => {
        api.get("/teacher/my-subjects")
            .then(res => {
                setMySubjects(res.data.subjects || []);
            })
            .catch(err => {
                console.error("Failed to load subjects:", err);
                setMySubjects([]);
            });
    }, []);

    // When subject is selected, get all course-section combinations for that subject
    useEffect(() => {
        if (!subjectId) {
            setAssignments([]);
            setCourses([]);
            setSections([]);
            setCourseId("");
            setSectionId("");
            return;
        }

        const selectedSubject = mySubjects.find(s => s.id === parseInt(subjectId));
        if (selectedSubject && selectedSubject.assignments) {
            setAssignments(selectedSubject.assignments);
            
            // Extract unique courses from assignments
            const uniqueCourses = [];
            const courseIds = new Set();
            selectedSubject.assignments.forEach(assignment => {
                if (!courseIds.has(assignment.course_id)) {
                    courseIds.add(assignment.course_id);
                    uniqueCourses.push({
                        id: assignment.course_id,
                        name: assignment.course_name,
                        code: assignment.course_code
                    });
                }
            });
            setCourses(uniqueCourses);
        } else {
            setAssignments([]);
            setCourses([]);
        }
        
        setSections([]);
        setCourseId("");
        setSectionId("");
    }, [subjectId, mySubjects]);

    // When course is selected, get sections for that course-subject combination
    useEffect(() => {
        if (!courseId || !subjectId) {
            setSections([]);
            setSectionId("");
            return;
        }

        // Filter assignments to get sections for selected subject-course combination
        const relevantAssignments = assignments.filter(
            a => a.course_id === parseInt(courseId)
        );
        
        const uniqueSections = [];
        const sectionIds = new Set();
        relevantAssignments.forEach(assignment => {
            if (!sectionIds.has(assignment.section_id)) {
                sectionIds.add(assignment.section_id);
                uniqueSections.push({
                    id: assignment.section_id,
                    name: assignment.section_name,
                    assignment_id: assignment.assignment_id
                });
            }
        });
        setSections(uniqueSections);
        setSectionId("");
    }, [courseId, subjectId, assignments]);

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

        // Find the assignment_id for the selected combination
        const selectedAssignment = assignments.find(
            a => a.course_id === parseInt(courseId) && a.section_id === parseInt(sectionId)
        );

        if (!selectedAssignment) {
            alert("Invalid subject-course-section combination.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/teacher/tasks/create", {
                teacher_subject_assignment_id: selectedAssignment.assignment_id,
                title,
                description,
                difficulty,
                time_limit_minutes: timeLimit,
                deadline: deadline || null,
                questions
            });
            alert("Task created successfully!");
            // Reset form or navigate to tasks page
            window.location.href = "/teacher/dashboard";
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || "Failed to create task. Please try again.";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 w-full">
            <div className="px-8 py-6 space-y-6">
                
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3">
                                <span className="text-xl">📝</span>
                                <span>Task Creation</span>
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Create New Lab Task
                                </span>
                            </h1>
                            <p className="text-base text-slate-600">
                                Design programming challenges for your students
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                                <span className="text-4xl">🎯</span>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Assignment Target - NOW FIRST */}
                    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">🎯</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Assignment Target</h2>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Subject *
                                    </label>
                                    <select 
                                        value={subjectId} 
                                        onChange={e => setSubjectId(e.target.value)} 
                                        required 
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                                    >
                                        <option value="">Select subject</option>
                                        {mySubjects.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} ({s.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Course *
                                    </label>
                                    <select 
                                        value={courseId} 
                                        onChange={e => setCourseId(e.target.value)} 
                                        required 
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                                        disabled={!subjectId}
                                    >
                                        <option value="">Select course</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Section *
                                    </label>
                                    <select 
                                        value={sectionId} 
                                        onChange={e => setSectionId(e.target.value)} 
                                        required 
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                                        disabled={!courseId}
                                    >
                                        <option value="">Select section</option>
                                        {sections.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information - NOW SECOND */}
                    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">ℹ️</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                <div className="lg:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        Task Title *
                                    </label>
                                    <input 
                                        type="text" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                                        placeholder="e.g., Sorting Algorithm Implementation"
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Difficulty
                                    </label>
                                    <select 
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                                        value={difficulty} 
                                        onChange={(e) => setDifficulty(e.target.value)}
                                    >
                                        {DIFFICULTY.map(d => (
                                            <option key={d} value={d}>
                                                {d.charAt(0).toUpperCase() + d.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Time Limit (minutes)
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max="180" 
                                        value={timeLimit} 
                                        onChange={(e) => setTimeLimit(Number(e.target.value))} 
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Deadline
                                    </label>
                                    <input 
                                        type="datetime-local" 
                                        value={deadline} 
                                        onChange={(e) => setDeadline(e.target.value)} 
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    Task Description
                                </label>
                                <textarea 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 resize-none"
                                    rows={4}
                                    placeholder="Provide detailed instructions for the task..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Questions Section - REMAINS SAME */}
                    <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                        <span className="text-xl">❓</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Questions *</h2>
                                        <p className="text-xs text-slate-600">Add programming challenges</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold">
                                    {questions.length} Question{questions.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-5">
                            {questions.map((q, i) => (
                                <div 
                                    key={i} 
                                    className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200 hover:border-indigo-300 transition-all"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                                                {i + 1}
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900">Question {i + 1}</h3>
                                        </div>
                                        {questions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(i)}
                                                className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-semibold text-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 mb-2 block">Question Text *</label>
                                            <textarea
                                                value={q.text}
                                                onChange={e => updateQuestion(i, "text", e.target.value)}
                                                placeholder="Write your question here..."
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-slate-900 resize-none"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-sm font-semibold text-slate-700 mb-2 block">Programming Language</label>
                                                <select
                                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-slate-900 font-medium"
                                                    value={q.language}
                                                    onChange={e => updateQuestion(i, "language", e.target.value)}
                                                >
                                                    {PROGRAMMING_LANGUAGES.map(l => (
                                                        <option key={l} value={l}>
                                                            {l.charAt(0).toUpperCase() + l.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold text-slate-700 mb-2 block">Expected Output *</label>
                                                <textarea
                                                    value={q.expectedOutput}
                                                    onChange={e => updateQuestion(i, "expectedOutput", e.target.value)}
                                                    placeholder="Expected output"
                                                    rows={1}
                                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-slate-900 resize-none font-mono text-sm"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold text-slate-700 mb-2 block">Marks *</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    value={q.marks}
                                                    onChange={e => updateQuestion(i, "marks", Number(e.target.value))}
                                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-slate-900 font-medium"
                                                    placeholder="25"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addQuestion}
                                className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-semibold px-6 py-4 rounded-xl hover:bg-slate-200 transition-all border-2 border-dashed border-slate-300 hover:border-slate-400"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Another Question
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Link
                            to="/teacher/dashboard"
                            className="flex items-center gap-2 bg-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:bg-slate-300 transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Publish Task
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}