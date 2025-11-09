import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import OTPVerificationPage from './pages/auth/OTPVerificationPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherSetup from './pages/teacher/TeacherSetup';
import TaskCreation from './pages/teacher/TaskCreation';
import TaskSubmissions from './pages/teacher/TaskSubmissions';
import LivePreview from './pages/teacher/LivePreview';
import StudentPerformance from './pages/teacher/StudentPerformance';
import ClassAnalytics from './pages/teacher/ClassAnalytics';
import SubjectManagement from './pages/teacher/SubjectManagement';
import TeacherProfile from './pages/teacher/TeacherProfile';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentSubjects from './pages/student/StudentSubjects';
import StudentTasks from './pages/student/StudentTasks';
import TaskAttempt from './pages/student/TaskAttempt';
import StudentAnalytics from './pages/student/StudentAnalytics';
import Leaderboard from './pages/student/Leaderboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentSubjectDetails from './pages/student/StudentSubjectDetails';
import StudentTaskDetails from './pages/student/StudentTaskDetails';
import StudentTaskAttempt from './pages/student/StudentTaskAttempt';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationToast from './components/NotificationToast';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/verify-otp" element={<OTPVerificationPage />} />

              {/* Teacher Routes */}
              <Route
                path="/teacher/setup"
                element={
                  <ProtectedRoute role="teacher">
                    <TeacherSetup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/dashboard"
                element={
                  <ProtectedRoute role="teacher">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="teacher" />
                      <TeacherDashboard />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/tasks"
                element={
                  <ProtectedRoute role="teacher">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="teacher" />
                      <StudentTasks />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/tasks/create"
                element={
                  <ProtectedRoute role="teacher">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="teacher" />
                      <TaskCreation />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/live-preview"
                element={
                  <ProtectedRoute role="teacher">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="teacher" />
                      <LivePreview />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/analytics"
                element={
                  <ProtectedRoute role="teacher">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="teacher" />
                      <StudentPerformance />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/class-analytics"
                element={
                  <ProtectedRoute role="teacher">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="teacher" />
                      <ClassAnalytics />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/profile"
                element={
                  <ProtectedRoute role="teacher">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="teacher" />
                      <TeacherProfile />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/subjects"
                element={
                  <ProtectedRoute role="teacher">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="teacher" />
                      <SubjectManagement />
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute role="student">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="student" />
                      <StudentDashboard />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/subjects"
                element={
                  <ProtectedRoute role="student">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="student" />
                      <StudentSubjects />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/tasks"
                element={
                  <ProtectedRoute role="student">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="student" />
                      <StudentTasks />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/tasks/:taskId"
                element={
                  <ProtectedRoute role="student">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="student" />
                      <TaskAttempt />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/analytics"
                element={
                  <ProtectedRoute role="student">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="student" />
                      <StudentAnalytics />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/leaderboard"
                element={
                  <ProtectedRoute role="student">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="student" />
                      <Leaderboard />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute role="student">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="student" />
                      <StudentProfile />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/subjects/:subjectId"
                element={
                  <ProtectedRoute role="student">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="student" />
                      <StudentSubjectDetails />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/tasks/:taskId"
                element={
                  <ProtectedRoute role="student">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="student" />
                      <StudentTaskDetails />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/tasks/:taskId/attempt"
                element={
                  <ProtectedRoute role="student">
                    <Navbar />
                    <div className="flex">
                      <Sidebar role="student" />
                      <StudentTaskAttempt />
                    </div>
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <NotificationToast />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
