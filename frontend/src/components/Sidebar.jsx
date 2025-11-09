import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

const Sidebar = ({ role }) => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const teacherMenu = [
    { label: "Dashboard", path: "/teacher/dashboard" },
    { label: "Subjects", path: "/teacher/subjects" },
    { label: "Create Task", path: "/teacher/tasks/create" },
    { label: "Live Preview", path: "/teacher/live-preview" },
    { label: "Analytics", path: "/teacher/analytics" },
    { label: "Class Analytics", path: "/teacher/class-analytics" },
    { label: "Profile", path: "/teacher/profile" }
  ];

  const studentMenu = [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "Subjects", path: "/student/subjects" },
    { label: "Lab Tasks", path: "/student/tasks" },
    { label: "Analytics", path: "/student/analytics" },
    { label: "Leaderboard", path: "/student/leaderboard" },
    { label: "Notifications", path: "/student/notifications" },
    { label: "Profile", path: "/student/profile" }
  ];

  const menu = role === "teacher" ? teacherMenu : studentMenu;

  return (
    <aside 
      className={`
        ${isOpen ? "w-64" : "w-20"}
        bg-gray-900 
        text-white 
        h-screen 
        sticky 
        top-16 
        transition-all 
        duration-300 
        overflow-hidden
        shadow-lg
      `}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <span className="text-xl">{isOpen ? "◀" : "▶"}</span>
      </button>

      <nav className="space-y-2 p-4" role="navigation" aria-label="Main navigation">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              block 
              px-4 
              py-3 
              rounded-lg 
              transition-colors
              ${location.pathname === item.path 
                ? "bg-blue-500 text-white" 
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }
              ${!isOpen && "px-2 text-center"}
            `}
            title={!isOpen ? item.label : undefined}
            aria-current={location.pathname === item.path ? "page" : undefined}
          >
            {isOpen ? item.label : item.label[0]}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  role: PropTypes.oneOf(['teacher', 'student']).isRequired
};

export default Sidebar;