import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
export default function ProtectedRoute({ role, children }) {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/auth/login" replace />;
    if (role && user.role !== role) return <Navigate to="/" replace />;
    return children;
}