import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    api.get("/student/profile")
      .then(res => {
        setProfile(res.data.student);
        setFormData(res.data.student);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    try {
      await api.put("/student/profile", formData);
      setProfile(formData);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl animate-spin mx-auto mb-4" 
               style={{ animationDuration: '3s' }} />
          <p className="text-slate-600 font-medium mt-3">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-4xl">⚠️</span>
            </div>
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">👤</span>
                <span>Student Profile</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Profile
                </span>
              </h1>
              <p className="text-base text-slate-600">
                Manage your personal information and account settings
              </p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
          
          {/* Profile Content */}
          <div className="px-8 pb-8">
            
            {/* Avatar & Edit Button */}
            <div className="flex items-end justify-between -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-xl">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={saveChanges}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-300 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Profile Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name
                </label>
                {!editMode ? (
                  <p className="text-lg font-bold text-slate-900 bg-slate-50 px-4 py-3 rounded-xl">
                    {profile.name}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => handleChange("name", e.target.value)}
                    className="w-full text-lg font-semibold text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 px-4 py-3 rounded-xl focus:outline-none transition-colors"
                  />
                )}
              </div>

              {/* Email */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </label>
                <p className="text-lg font-bold text-slate-900 bg-slate-50 px-4 py-3 rounded-xl flex items-center gap-2">
                  {profile.email}
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Verified</span>
                </p>
              </div>

              {/* Roll Number */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Roll Number
                </label>
                <p className="text-lg font-bold text-slate-900 bg-slate-50 px-4 py-3 rounded-xl">
                  {profile.roll_no || "N/A"}
                </p>
              </div>

              {/* Course */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Course
                </label>
                <p className="text-lg font-bold text-slate-900 bg-slate-50 px-4 py-3 rounded-xl">
                  {profile.course || profile.department || "N/A"}
                </p>
              </div>

              {/* Section */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Section
                </label>
                <p className="text-lg font-bold text-slate-900 bg-slate-50 px-4 py-3 rounded-xl">
                  {profile.section || "N/A"}
                </p>
              </div>

              {/* Phone */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone Number
                </label>
                {!editMode ? (
                  <p className="text-lg font-bold text-slate-900 bg-slate-50 px-4 py-3 rounded-xl">
                    {profile.phone || "Not provided"}
                  </p>
                ) : (
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={e => handleChange("phone", e.target.value)}
                    className="w-full text-lg font-semibold text-slate-900 bg-slate-50 border-2 border-slate-200 focus:border-purple-500 px-4 py-3 rounded-xl focus:outline-none transition-colors"
                    placeholder="Enter phone number"
                  />
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Enrollment Year</p>
                <p className="text-xl font-bold text-slate-900">{profile.enrollmentYear || "2024"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Account Status</p>
                <p className="text-xl font-bold text-green-600">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Badges Earned</p>
                <p className="text-xl font-bold text-slate-900">{profile.badges || 0}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}