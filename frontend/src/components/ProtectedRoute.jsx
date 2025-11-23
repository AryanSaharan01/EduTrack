import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
export default function ProtectedRoute({ role, children }) {
    const { user, loading } = useContext(AuthContext);
    if (loading) return null; // or a spinner
    if (!user) return <Navigate to="/auth/login" replace />;
    if (role && user.role !== role) return <Navigate to="/" replace />;
    return children;
}