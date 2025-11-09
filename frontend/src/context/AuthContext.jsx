import React, { createContext, useState, useCallback } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
            return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendOTP = useCallback(async (email, role) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/auth/send-otp", { email, role });
            return { 
                success: res.data.success, 
                otp: res.data.otp 
            };
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
            return { 
                success: false, 
                error: err.response?.data?.error || "Failed to send OTP" 
            };
        } finally {
            setLoading(false);
        }
    }, []);

    const verifyOTP = useCallback(async (email, otp, role) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/auth/verify-otp", { email, otp, role });
            const { token, user } = res.data;

            // Store auth data
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            
            // Update state
            setToken(token);
            setUser(user);

            return { success: true, user };
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to verify OTP";
            setError(errorMessage);
            return { 
                success: false, 
                error: errorMessage 
            };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        try {
            // Clear local storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Reset state
            setToken(null);
            setUser(null);
            setError(null);
        } catch (err) {
            console.error("Logout failed:", err);
            setError("Failed to logout properly");
        }
    }, []);

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                token, 
                loading, 
                error,
                sendOTP, 
                verifyOTP, 
                logout 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}