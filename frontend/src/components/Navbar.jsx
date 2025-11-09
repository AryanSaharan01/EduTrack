import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { dark, toggle } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-40 w-full">
      <div className="max-w-full px-6 py-4 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">CM</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            CodeMaster LMS
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={toggle}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? (
              <span role="img" aria-label="Light mode">
                ☀️
              </span>
            ) : (
              <span role="img" aria-label="Dark mode">
                🌙
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.email}
              </span>
            )}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}