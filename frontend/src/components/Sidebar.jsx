import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const teacherMenu = [
    { 
      label: "Dashboard", 
      path: "/teacher/dashboard",
      icon: "🏠",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500"
    },
    { 
      label: "Subjects", 
      path: "/teacher/subjects",
      icon: "📚",
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500"
    },
    { 
      label: "Create Task", 
      path: "/teacher/tasks/create",
      icon: "➕",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500"
    },
    { 
      label: "Live Preview", 
      path: "/teacher/live-preview",
      icon: "👁️",
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500"
    },
    { 
      label: "Analytics", 
      path: "/teacher/analytics",
      icon: "📊",
      gradient: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-500"
    },
    { 
      label: "Class Analytics", 
      path: "/teacher/class-analytics",
      icon: "👥",
      gradient: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-500"
    },
    { 
      label: "Profile", 
      path: "/teacher/profile",
      icon: "👤",
      gradient: "from-slate-600 to-slate-700",
      bgColor: "bg-slate-600"
    }
  ];

  const studentMenu = [
    { 
      label: "Dashboard", 
      path: "/student/dashboard",
      icon: "🏠",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500"
    },
    { 
      label: "Subjects", 
      path: "/student/subjects",
      icon: "📚",
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500"
    },
    { 
      label: "Lab Tasks", 
      path: "/student/tasks",
      icon: "📝",
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500"
    },
    { 
      label: "Performance", 
      path: "/student/analytics",
      icon: "📈",
      gradient: "from-teal-500 to-green-500",
      bgColor: "bg-teal-500"
    },
    { 
      label: "Leaderboard", 
      path: "/student/leaderboard",
      icon: "🏆",
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500"
    },
    { 
      label: "Notifications", 
      path: "/student/notifications",
      icon: "🔔",
      gradient: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500"
    },
    { 
      label: "Profile", 
      path: "/student/profile",
      icon: "👤",
      gradient: "from-slate-600 to-slate-700",
      bgColor: "bg-slate-600"
    }
  ];

  const menu = role === "teacher" ? teacherMenu : studentMenu;

  return (
    <aside 
      className={`
        ${isOpen ? "w-72" : "w-20"}
        bg-white
        border-r border-slate-200
        h-screen 
        sticky 
        top-16 
        transition-all 
        duration-300 
        overflow-hidden
        shadow-lg
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 transition-all focus:outline-none group border-b border-slate-200"
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`
              w-11 h-11 
              bg-gradient-to-br from-teal-500 to-blue-600 
              rounded-2xl 
              flex items-center justify-center
              group-hover:scale-110 
              group-hover:rotate-12
              transition-all
              shadow-lg
            `}>
              <span className="text-white text-xl font-bold">
                {isOpen ? "◀" : "▶"}
              </span>
            </div>
            {isOpen && (
              <div>
                <div className="text-sm font-bold text-slate-800">Navigation</div>
                <div className="text-xs text-slate-500">Quick access menu</div>
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Navigation */}
      <nav className="space-y-2 p-4" role="navigation" aria-label="Main navigation">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group
                relative
                flex 
                items-center
                gap-4
                px-4 
                py-4
                rounded-2xl
                transition-all
                duration-200
                overflow-hidden
                ${isActive 
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl shadow-${item.bgColor}/25 scale-105` 
                  : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:scale-105"
                }
                ${!isOpen && "justify-center"}
              `}
              title={!isOpen ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Background Glow Effect */}
              {isActive && (
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 blur-xl`} />
              )}

              {/* Icon */}
              <span className={`
                text-3xl
                flex-shrink-0
                ${isActive ? "scale-110 drop-shadow-lg" : "group-hover:scale-110"}
                transition-transform
                relative
                z-10
              `}>
                {item.icon}
              </span>

              {/* Label */}
              {isOpen && (
                <div className="flex-1 relative z-10">
                  <span className={`font-bold text-sm ${isActive ? "text-white" : "text-slate-800"}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="h-0.5 bg-white/50 rounded-full mt-1" />
                  )}
                </div>
              )}

              {/* Active Indicator Arrow */}
              {isOpen && isActive && (
                <svg className="w-5 h-5 ml-auto relative z-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}

              {/* Hover Glow Effect */}
              {!isActive && (
                <div className={`
                  absolute inset-0 
                  bg-gradient-to-r ${item.gradient}
                  opacity-0 
                  group-hover:opacity-10
                  rounded-2xl
                  transition-opacity
                `} />
              )}
            </Link>
          );
        })}

        {/* Logout Button */}
        <div className="pt-4 mt-4 border-t border-slate-200">
          <button
            onClick={() => {/* Add logout logic */}}
            className={`
              group
              relative
              flex 
              items-center
              gap-4
              px-4 
              py-4
              rounded-2xl
              transition-all
              duration-200
              text-red-600
              hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50
              hover:scale-105
              hover:shadow-lg
              w-full
              overflow-hidden
              ${!isOpen && "justify-center"}
            `}
            title={!isOpen ? "Logout" : undefined}
          >
            <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform relative z-10">
              🚪
            </span>
            {isOpen && (
              <div className="flex-1 relative z-10">
                <span className="font-bold text-sm">
                  Logout
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity" />
          </button>
        </div>
      </nav>

      {/* Bottom Info Card - Expanded */}
      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl p-4 shadow-xl text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                <div className="text-xs font-bold">
                  System Active
                </div>
              </div>
              <div className="text-sm font-semibold mb-1">
                EduTrack Pro
              </div>
              <div className="text-xs text-teal-100">
                Version 1.0.0 Beta
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed View - Status Indicator */}
      {!isOpen && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
          </div>
        </div>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  role: PropTypes.oneOf(['teacher', 'student']).isRequired
};

export default Sidebar;