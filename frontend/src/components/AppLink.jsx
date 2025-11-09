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