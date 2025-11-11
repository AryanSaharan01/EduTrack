import React from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

export default function AppLink({ 
    to, 
    children, 
    newTab = false, 
    ariaLabel, 
    className = "", 
    state = null 
}) {
    const isExternal = typeof to === "string" && 
        (/^https?:\/\//i.test(to) || to.startsWith("//") || to.startsWith("mailto:"));
    const location = useLocation();

    if (isExternal) {
        return (
            <a 
                href={to} 
                target={newTab ? "_blank" : "_self"} 
                rel={newTab ? "noopener noreferrer" : undefined}
                aria-label={ariaLabel} 
                className={className}
            >
                {children}
            </a>
        );
    }

    return (
        <Link 
            to={to} 
            state={state ?? { from: location.pathname }} 
            aria-label={ariaLabel} 
            className={className}
        >
            {children}
        </Link>
    );
}

AppLink.propTypes = {
    to: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired,
    children: PropTypes.node.isRequired,
    newTab: PropTypes.bool,
    ariaLabel: PropTypes.string,
    className: PropTypes.string,
    state: PropTypes.object
};

// In SubjectManagement.jsx, replace AppLink import and usage:
// import { Link } from "react-router-dom";

// Then replace AppLink with Link:
<Link 
  to="/teacher/subjects/assign" 
  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap"
>
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
  Add New Subject
</Link>