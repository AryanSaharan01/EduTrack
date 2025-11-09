import React from "react";
import AppLink from "../components/AppLink.jsx";
export default function NotFound() {
    return (
        <div className="page flex items-center justify-center text-center">
            <div>
                <h1 className="text-9xl font-bold text-gray-500 mb-4">404</h1>
                <p className="text-xl mb-6">Oops! The page you're looking for does not exist.</p>
                <AppLink to="/" className="btn-primary">Go to Home</AppLink>
            </div>
        </div>
    );
}