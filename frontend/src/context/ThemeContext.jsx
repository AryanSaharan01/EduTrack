import React, { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("dark") || "false");
    } catch (error) {
      console.error("Failed to parse theme from localStorage:", error);
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("dark", JSON.stringify(dark));
      document.documentElement.classList.toggle("dark", dark);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }
  }, [dark]);

  const toggle = () => setDark(prevDark => !prevDark);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};