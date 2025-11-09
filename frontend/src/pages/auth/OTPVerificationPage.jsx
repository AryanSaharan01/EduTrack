import React, { useContext, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

export default function OTPVerificationPage() {
  const { verifyOTP, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { email, role } = location.state || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(60);
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
      setTimer(60);
      navigate("/auth/login", { replace: true, state: { role } });
    }
  };

  const maskedEmail = email ? email.replace(/(?<=.).(?=[^@]*?@)/g, "*") : "";

  return (
    <div className="page flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Verify OTP
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Enter the 6-digit code sent to {maskedEmail}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between gap-2 mb-4">
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
                className="w-12 h-12 text-center rounded-md border border-gray-400 text-2xl dark:bg-gray-800 dark:text-white dark:border-gray-600"
                autoFocus={index === 0}
              />
            ))}
          </div>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <button type="submit" disabled={loading} className="w-full btn-primary">
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          type="button"
          disabled={timer > 0}
          onClick={handleResend}
          className={`mt-4 w-full btn-secondary ${
            timer > 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </button>

        <button
          type="button"
          className="mt-4 w-full btn-secondary"
          onClick={() => navigate("/auth/login")}
        >
          Change Email
        </button>
      </div>
    </div>
  );
}