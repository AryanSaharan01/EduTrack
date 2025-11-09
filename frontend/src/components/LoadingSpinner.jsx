import React from "react";
import PropTypes from 'prop-types';

export default function LoadingSpinner({ 
  size = 8,
  color = "blue-600",
  className = ""
}) {
  return (
    <div 
      className={`flex justify-center items-center p-4 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div 
        className={`
          animate-spin 
          rounded-full 
          h-${size} 
          w-${size} 
          border-2 
          border-${color} 
          border-t-transparent
        `}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

LoadingSpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string
};