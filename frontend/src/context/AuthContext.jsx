import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      // Decode token and set user (you can add JWT decode here)
      const userData = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(userData);
    }
  }, [token]);

  // Send OTP
  const sendOTP = async (email, role) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const endpoint = `${apiUrl}/auth/send-otp`; // ✅ Changed from /send-otp to /auth/send-otp
      
      console.log('📤 Sending OTP...');
      console.log('  Email:', email);
      console.log('  Role:', role);
      console.log('  API URL:', apiUrl);
      console.log('  Full endpoint:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, role })
      });

      console.log('📨 Response status:', response.status);

      const data = await response.json();
      console.log('📨 Response data:', data);

      if (!response.ok) {
        console.error('❌ Request failed:', data);
        return {
          success: false,
          error: data.error || data.message || 'Failed to send OTP'
        };
      }

      return {
        success: true,
        message: data.message,
        otp: data.otp
      };

    } catch (error) {
      console.error('❌ Send OTP Error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      return {
        success: false,
        error: error.message || 'Network error. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (email, otp, role) => {
    setLoading(true);
    try {
      console.log('🔐 Verifying OTP for:', email);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ email, otp, role })
      });

      const data = await response.json();
      console.log('✅ Verify OTP Response:', data);

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Invalid OTP'
        };
      }

      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      return {
        success: true,
        user: data.user,
        isFirstTime: !data.user.profile // First time if no profile
      };

    } catch (error) {
      console.error('❌ Verify OTP Error:', error);
      return {
        success: false,
        error: error.message || 'Network error. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    sendOTP,
    verifyOTP,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};