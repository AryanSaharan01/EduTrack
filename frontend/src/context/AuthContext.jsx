import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // start as true
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      // Decode token and set user (you can add JWT decode here)
      const userData = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(userData);
    }
    setLoading(false); // done restoring
  }, [token]);

  // Helper function to add timeout to fetch
  const fetchWithTimeout = async (url, options, timeout = 30000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server took too long to respond');
      }
      throw error;
    }
  };

  // Send OTP
  const sendOTP = async (email, role) => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const endpoint = `${apiUrl}/auth/send-otp`;
      
      console.log('📤 Sending OTP...');
      console.log('  Email:', email);
      console.log('  Role:', role);
      console.log('  API URL:', apiUrl);
      console.log('  Full endpoint:', endpoint);
      
      const response = await fetchWithTimeout(
        endpoint,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ email, role })
        },
        30000 // 30 second timeout
      );

      console.log('📨 Response status:', response.status);
      console.log('📨 Response ok:', response.ok);

      // Try to parse JSON response
      let data;
      try {
        const text = await response.text();
        console.log('📨 Raw response:', text);
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        return {
          success: false,
          error: 'Invalid response from server'
        };
      }

      console.log('📨 Parsed data:', data);

      if (!response.ok) {
        console.error('❌ Request failed:', data);
        return {
          success: false,
          error: data.error || data.message || `Server error: ${response.status}`
        };
      }

      console.log('✅ OTP sent successfully');
      return {
        success: true,
        message: data.message || 'OTP sent successfully',
        otp: data.otp // Only in dev mode
      };

    } catch (error) {
      console.error('❌ Send OTP Error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.message || 'Network error. Please check your connection.'
      };
    } finally {
      console.log('🔄 Resetting loading state');
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOTP = async (email, otp, role) => {
    setLoading(true);
    try {
      console.log('🔐 Verifying OTP for:', email);

      const response = await fetchWithTimeout(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ email, otp, role })
        },
        30000
      );

      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('❌ Failed to parse verify response:', parseError);
        return {
          success: false,
          error: 'Invalid response from server'
        };
      }

      console.log('✅ Verify OTP Response:', data);

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'Invalid OTP'
        };
      }

      // Save token and user data
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      }

      return {
        success: true,
        user: data.user,
        isFirstTime: !data.user?.profile
      };

    } catch (error) {
      console.error('❌ Verify OTP Error:', error);
      return {
        success: false,
        error: error.message || 'Network error. Please try again.'
      };
    } finally {
      console.log('🔄 Resetting loading state (verify)');
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