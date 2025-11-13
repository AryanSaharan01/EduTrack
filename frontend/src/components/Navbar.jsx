import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { dark, toggle } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 w-full shadow-sm backdrop-blur-lg bg-white/95">
      <div className="max-w-full px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-lg md:text-xl">ET</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              EduTrack Pro
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Learning Management System
            </p>
          </div>
          <div className="block sm:hidden">
            <h1 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              EduTrack
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="relative p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 transition-all shadow-sm hover:shadow-md group"
            aria-label="Toggle theme"
          >
            <div className="relative w-4 h-4 md:w-5 md:h-5">
              {dark ? (
                <span className="text-base md:text-xl group-hover:rotate-12 transition-transform inline-block">
                  ☀️
                </span>
              ) : (
                <span className="text-base md:text-xl group-hover:rotate-12 transition-transform inline-block">
                  🌙
                </span>
              )}
            </div>
          </button>

          {/* User Info - Desktop Only */}
          {user?.email && (
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-medium">
                  Logged in as
                </span>
                <span className="text-sm text-slate-800 font-semibold truncate max-w-[150px]">
                  {user.email}
                </span>
              </div>
            </div>
          )}

          {/* User Avatar - Mobile/Tablet Only */}
          {user?.email && (
            <div className="flex lg:hidden items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg shadow-sm">
              <span className="text-white text-sm md:text-base font-bold">
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="group relative px-3 py-2 md:px-6 md:py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg md:rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-1 md:gap-2">
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline text-sm md:text-base">Logout</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500" />
    </nav>
  );
}