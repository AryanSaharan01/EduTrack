import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
export default function ThemeToggle() {
    const { dark, toggle } = useContext(ThemeContext);
    return (
        <button
            onClick={toggle}
            aria-label="Toggle dark/light theme"
            className="p-2 rounded bg-gray-200 dark:bg-gray-700"
        >
            {dark ? "☀ " : ""}
        </button>
    );
}