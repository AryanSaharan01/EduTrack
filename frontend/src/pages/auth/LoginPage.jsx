import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import AppLink from "../../components/AppLink.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, sendOTP } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(() => location.state?.role || "student");
  const [error, setError] = useState(null);
  const [successOtp, setSuccessOtp] = useState(null);

  if (user) {
    navigate(user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessOtp(null);

    if (!email) {
      setError("Please enter a valid email.");
      return;
    }

    // Use the sendOTP function from AuthContext
    const result = await sendOTP(email, role);

    if (result.success) {
      // Show OTP in dev mode
      if (result.otp) {
        setSuccessOtp(result.otp);
        console.log('🔑 Dev OTP:', result.otp);
      }
      // Navigate to OTP verification page
      navigate("/auth/verify-otp", { state: { email, role } });
    } else {
      setError(result.error || result.message || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ET</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-slate-800">EduTrack</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-teal-100 text-teal-700 font-semibold">
                PRO
              </span>
            </div>
          </div>
          <AppLink
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-teal-600 transition"
          >
            ← Back to Home
          </AppLink>
        </div>
      </nav>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-10 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-teal-50">Sign in to continue your learning journey</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition ${role === "teacher"
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200 hover:border-teal-300 hover:bg-slate-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="teacher"
                      checked={role === "teacher"}
                      onChange={(e) => setRole(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-3xl mb-2">👨‍🏫</div>
                      <span className={`text-sm font-semibold ${role === "teacher" ? "text-teal-700" : "text-slate-700"}`}>
                        Teacher
                      </span>
                    </div>
                    {role === "teacher" && (
                      <div className="absolute top-2 right-2">
                        <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>

                  <label
                    className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition ${role === "student"
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200 hover:border-teal-300 hover:bg-slate-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={role === "student"}
                      onChange={(e) => setRole(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-3xl mb-2">🎓</div>
                      <span className={`text-sm font-semibold ${role === "student" ? "text-teal-700" : "text-slate-700"}`}>
                        Student
                      </span>
                    </div>
                    {role === "student" && (
                      <div className="absolute top-2 right-2">
                        <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send OTP
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Don&apos;t have an account?{" "}
                  <AppLink
                    to="/auth/signup"
                    className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition"
                  >
                    Sign up for free
                  </AppLink>
                </p>
              </div>
            </form>
          </div>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-medium text-slate-600">Secure OTP Authentication</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-500">
            &copy; 2025 EduTrack Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
