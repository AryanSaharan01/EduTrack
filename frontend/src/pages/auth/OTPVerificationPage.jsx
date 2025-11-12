import React, { useContext, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import AppLink from "../../components/AppLink.jsx";

export default function OTPVerificationPage() {
  const { verifyOTP, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { email, role } = location.state || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(120); // 120 seconds = 2 minutes
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email || !role) navigate("/auth/login");
  }, [email, role, navigate]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(interval);
  }, [timer]);

  const handleChange = (index, e) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);
      if (val && index < 5) inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((x) => x === "")) {
      setError("Please enter the full 6-digit OTP.");
      return;
    }
    setError(null);
    const code = otp.join("");
    const res = await verifyOTP(email, code, role);

    if (res.success) {
      if (res.user.isFirstTime) {
        navigate(role === "teacher" ? "/teacher/setup" : "/student/dashboard");
      } else {
        navigate(role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
      }
    } else {
      setError(res.error || "OTP verification failed.");
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(120); // Reset to 2 minutes
      navigate("/auth/login", { replace: true, state: { role } });
    }
  };

  const maskedEmail = email ? email.replace(/(?<=.).(?=[^@]*?@)/g, "*") : "";

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
            to="/auth/login"
            className="text-sm font-medium text-slate-600 hover:text-teal-600 transition"
          >
            ← Back to Login
          </AppLink>
        </div>
      </nav>

      {/* OTP Verification Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-10 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Verify OTP</h2>
              <p className="text-teal-50">Enter the verification code we sent to</p>
              <p className="text-white font-semibold mt-1">{maskedEmail}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* OTP Input Boxes */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4 text-center">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center gap-3">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleChange(index, e)}
                      onKeyDown={(e) => handleBackspace(index, e)}
                      ref={(el) => (inputsRef.current[index] = el)}
                      className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Timer Display */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-600">
                    {timer > 0 ? `Code expires in ${timer}s` : "Code expired"}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Verify Button */}
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
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Verify & Continue
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Resend OTP Button */}
              <button
                type="button"
                disabled={timer > 0}
                onClick={handleResend}
                className={`w-full bg-white border-2 border-slate-200 text-slate-700 font-semibold px-6 py-3.5 rounded-xl transition ${
                  timer > 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700"
                }`}
              >
                {timer > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resend in {timer}s
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Resend OTP
                  </span>
                )}
              </button>

              {/* Change Email Link */}
              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Wrong email?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/auth/login")}
                    className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition"
                  >
                    Change email address
                  </button>
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
              <span className="text-xs font-medium text-slate-600">Protected by 256-bit Encryption</span>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Didn&apos;t receive the code? Check your spam folder or contact support.
            </p>
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