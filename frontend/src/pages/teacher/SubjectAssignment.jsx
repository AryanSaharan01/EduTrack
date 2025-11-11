import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api.js";

export default function SubjectAssignment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Data from API
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Selected values
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Load initial data
  useEffect(() => {
    loadSubjects();
    loadCourses();
  }, []);
  
  const loadSubjects = async () => {
    try {
      const res = await api.get("/teacher/subjects/available");
      setSubjects(res.data.subjects || []);
    } catch (err) {
      console.error("Failed to load subjects:", err);
      alert("Failed to load subjects");
    }
  };
  
  const loadCourses = async () => {
    try {
      const res = await api.get("/teacher/courses");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      alert("Failed to load courses");
    }
  };
  
  const loadSections = async (courseId) => {
    try {
      const res = await api.get(`/teacher/sections/${courseId}`);
      setSections(res.data.sections || []);
    } catch (err) {
      console.error("Failed to load sections:", err);
      alert("Failed to load sections");
    }
  };
  
  const loadStudents = async (courseId, sectionId) => {
    try {
      const res = await api.get(`/teacher/students/by-course-section/${courseId}/${sectionId}`);
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Failed to load students:", err);
      alert("Failed to load students");
    }
  };
  
  const handleSubjectChange = (subjectId) => {
    const subject = subjects.find(s => s.id === parseInt(subjectId));
    setSelectedSubject(subject);
    setSelectedCourse(null);
    setSelectedSection(null);
    setSelectedStudents([]);
    setSections([]);
    setStudents([]);
  };
  
  const handleCourseChange = (courseId) => {
    const course = courses.find(c => c.id === parseInt(courseId));
    setSelectedCourse(course);
    setSelectedSection(null);
    setSelectedStudents([]);
    setStudents([]);
    if (course) {
      loadSections(course.id);
    } else {
      setSections([]);
    }
  };
  
  const handleSectionChange = (sectionId) => {
    const section = sections.find(s => s.id === parseInt(sectionId));
    setSelectedSection(section);
    setSelectedStudents([]);
    if (section && selectedCourse) {
      loadStudents(selectedCourse.id, section.id);
    } else {
      setStudents([]);
    }
  };
  
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };
  
  const selectAllStudents = () => {
    setSelectedStudents(students.map(s => s.id));
  };
  
  const deselectAllStudents = () => {
    setSelectedStudents([]);
  };
  
  const handleNext = () => {
    if (!selectedSubject) {
      alert("Please select a subject");
      return;
    }
    if (!selectedCourse) {
      alert("Please select a course");
      return;
    }
    if (!selectedSection) {
      alert("Please select a section");
      return;
    }
    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }
    setStep(2);
  };
  
  const handleAssign = async () => {
    setLoading(true);
    try {
      const payload = {
        subject_id: selectedSubject.id,
        course_id: selectedCourse.id,
        section_id: selectedSection.id,
        student_ids: selectedStudents
      };
      
      const res = await api.post("/teacher/assign-subject", payload);
      alert(res.data.message || "Successfully assigned subject and enrolled students!");
      navigate("/teacher/dashboard");
    } catch (err) {
      console.error("Failed to assign subject:", err);
      const errorMsg = err.response?.data?.error || "Failed to assign subject";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">📚</span>
                <span>Subject Assignment</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Assign Subject to Students
                </span>
              </h1>
              <p className="text-base text-slate-600">
                Select a subject, course, section, and enroll students
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-slate-900">Step {step} of 2</span>
                <span className="text-xs text-slate-500">
                  {step === 1 ? "Select & Enroll" : "Review & Confirm"}
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
        
        {/* Step 1: Selection */}
        {step === 1 && (
          <div className="space-y-5">
            
            {/* Subject Selection */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📖</span>
                Select Subject
              </h2>
              <select
                value={selectedSubject?.id || ""}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
              >
                <option value="">-- Choose a subject --</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Course Selection */}
            {selectedSubject && (
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  Select Course
                </h2>
                <select
                  value={selectedCourse?.id || ""}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                >
                  <option value="">-- Choose a course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Section Selection */}
            {selectedCourse && (
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  Select Section
                </h2>
                <select
                  value={selectedSection?.id || ""}
                  onChange={(e) => handleSectionChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 font-medium"
                >
                  <option value="">-- Choose a section --</option>
                  {sections.map(section => (
                    <option key={section.id} value={section.id}>
                      Section {section.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Student Selection */}
            {selectedSection && students.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-2xl">👨‍🎓</span>
                    Select Students ({selectedStudents.length} / {students.length})
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllStudents}
                      className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-200 transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllStudents}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.map(student => (
                    <label
                      key={student.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudentSelection(student.id)}
                        className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{student.name}</div>
                        <div className="text-sm text-slate-600">
                          Roll No: {student.roll_no} | {student.email}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {/* No Students Message */}
            {selectedSection && students.length === 0 && (
              <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <p className="text-yellow-800 font-medium">
                  ⚠️ No students found for this course and section combination.
                </p>
              </div>
            )}
            
            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <Link 
                to="/teacher/dashboard"
                className="flex-1 flex items-center justify-center gap-2 bg-slate-200 text-slate-700 font-semibold px-6 py-4 rounded-xl hover:bg-slate-300 transition-all"
              >
                Cancel
              </Link>
              <button 
                onClick={handleNext}
                disabled={!selectedSubject || !selectedCourse || !selectedSection || selectedStudents.length === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Review */}
        {step === 2 && (
          <div className="space-y-5">
            
            {/* Review Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Review Assignment</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Please review the details below before confirming the assignment.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Assignment Summary */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Assignment Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl">📖</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-600">Subject</div>
                    <div className="text-lg font-bold text-slate-900">{selectedSubject?.name}</div>
                    <div className="text-sm text-slate-600">Code: {selectedSubject?.code}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-600">Course</div>
                    <div className="text-lg font-bold text-slate-900">{selectedCourse?.name}</div>
                    <div className="text-sm text-slate-600">Code: {selectedCourse?.code}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-600">Section</div>
                    <div className="text-lg font-bold text-slate-900">Section {selectedSection?.name}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl">👨‍🎓</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-600 mb-2">
                      Students ({selectedStudents.length})
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {students
                        .filter(s => selectedStudents.includes(s.id))
                        .map(student => (
                          <div key={student.id} className="text-sm text-slate-700">
                            • {student.name} ({student.roll_no})
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
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
                onClick={handleAssign}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Confirm Assignment
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
