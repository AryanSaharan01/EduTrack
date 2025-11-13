import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

export default function ThemeToggle() {
    const { dark, toggle } = useContext(ThemeContext);
    
    const handleToggle = () => {
        console.log("Theme toggle clicked. Current dark mode:", dark);
        toggle();
    };
    
    return (
        <button
            onClick={handleToggle}
            aria-label="Toggle dark/light theme"
            className="relative p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 transition-all shadow-sm hover:shadow-md group"
        >
            <div className="relative w-5 h-5">
                {dark ? (
                    <span className="text-xl group-hover:rotate-12 transition-transform inline-block">
                        ☀️
                    </span>
                ) : (
                    <span className="text-xl group-hover:rotate-12 transition-transform inline-block">
                        🌙
                    </span>
                )}
            </div>
        </button>
    );
}