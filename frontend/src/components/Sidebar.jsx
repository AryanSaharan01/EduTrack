import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import PropTypes from 'prop-types';

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = React.useContext(AuthContext);

  const teacherMenu = [
    { 
      label: "Dashboard", 
      path: "/teacher/dashboard",
      icon: "🏠",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      label: "Subjects", 
      path: "/teacher/subjects",
      icon: "📚",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      label: "Create Task", 
      path: "/teacher/tasks/create",
      icon: "➕",
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      label: "Live Preview", 
      path: "/teacher/live-preview",
      icon: "👁️",
      gradient: "from-orange-500 to-red-500"
    },
    { 
      label: "Analytics", 
      path: "/teacher/analytics",
      icon: "📊",
      gradient: "from-teal-500 to-cyan-500"
    },
    { 
      label: "Class Analytics", 
      path: "/teacher/class-analytics",
      icon: "👥",
      gradient: "from-indigo-500 to-purple-500"
    },
    { 
      label: "Profile", 
      path: "/teacher/profile",
      icon: "👤",
      gradient: "from-slate-500 to-slate-600"
    }
  ];

  const studentMenu = [
    { 
      label: "Dashboard", 
      path: "/student/dashboard",
      icon: "🏠",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      label: "Subjects", 
      path: "/student/subjects",
      icon: "📚",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      label: "Lab Tasks", 
      path: "/student/tasks",
      icon: "📝",
      gradient: "from-orange-500 to-red-500"
    },
    { 
      label: "Performance", 
      path: "/student/analytics",
      icon: "📈",
      gradient: "from-teal-500 to-green-500"
    },
    { 
      label: "Leaderboard", 
      path: "/student/leaderboard",
      icon: "🏆",
      gradient: "from-yellow-500 to-orange-500"
    },
    { 
      label: "Notifications", 
      path: "/student/notifications",
      icon: "🔔",
      gradient: "from-pink-500 to-rose-500"
    },
    { 
      label: "Profile", 
      path: "/student/profile",
      icon: "👤",
      gradient: "from-slate-500 to-slate-600"
    }
  ];

  const menu = role === "teacher" ? teacherMenu : studentMenu;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Auto-collapse on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    
    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <aside 
      className={`
        ${isOpen ? "w-64" : "w-20"}
        bg-white
        border-r border-slate-200
        sticky 
        top-16
        transition-all 
        duration-300
        h-[calc(100vh-4rem)]
        flex
        flex-col
        overflow-hidden
      `}
    >
      {/* Toggle Button */}
      <div className="flex-shrink-0 border-b border-slate-100 hidden md:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 text-left hover:bg-slate-50 transition-all focus:outline-none group"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-white text-xs font-bold">
                {isOpen ? "◀" : "▶"}
              </span>
            </div>
            {isOpen && (
              <div className="text-xs font-semibold text-slate-600">
                Menu
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
        <nav className="space-y-0.5 px-2" role="navigation">
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
                gap-2.5
                px-2.5 
                py-2.5
                rounded-lg
                transition-all
                ${isActive 
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.gradient.split(' ')[1]}/20` 
                  : "text-slate-600 hover:bg-slate-50"
                }
                ${!isOpen && "justify-center"}
              `}
              title={!isOpen ? item.label : undefined}
            >
              <span className="text-lg flex-shrink-0">
                {item.icon}
              </span>

              {isOpen && (
                <span className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-slate-700"}`}>
                  {item.label}
                </span>
              )}

              {isOpen && isActive && (
                <div className="ml-auto w-1 h-1 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
        </nav>
      </div>

      {/* Logout & Status - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-slate-100 bg-white">
        <div className="p-2 space-y-2">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`
              group
              flex 
              items-center
              gap-2.5
              px-2.5 
              py-2.5
              rounded-lg
              transition-all
              text-red-600
              hover:bg-red-50
              w-full
              ${!isOpen && "justify-center"}
            `}
            title={!isOpen ? "Logout" : undefined}
          >
            <span className="text-lg flex-shrink-0">🚪</span>
            {isOpen && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>

          {/* Bottom Status - Expanded Only */}
          {isOpen && (
            <div className="bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg p-2.5 text-white">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold">Online</span>
              </div>
              <div className="text-[10px] opacity-90">EduTrack v1.0</div>
            </div>
          )}

          {/* Collapsed Status Dot */}
          {!isOpen && (
            <div className="flex justify-center">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  role: PropTypes.oneOf(['teacher', 'student']).isRequired
};

export default Sidebar;