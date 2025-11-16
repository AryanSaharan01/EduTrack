import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";

export default function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/teacher/profile")
      .then(res => {
        setProfile(res.data.teacher);
        setFormData(res.data.teacher);
      })
      .catch(err => {
        console.error(err);
        // Load mock data for demo
        const mockProfile = {
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@university.edu",
          employee_id: "EMP12345",
          phone: "+1 (555) 123-4567",
          department: "Computer Science",
          qualification: "Ph.D. in Computer Science",
          experience_years: 8,
          bio: "Passionate educator with expertise in programming languages, algorithms, and software engineering. Dedicated to helping students excel in computer science.",
          profile_image_url: null
        };
        setProfile(mockProfile);
        setFormData(mockProfile);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      await api.put("/teacher/profile", formData);
      setProfile(formData);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl animate-spin mx-auto mb-4"
            style={{ animationDuration: '3s' }} />
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-slate-600 font-medium mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Profile</h2>
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:scale-105 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">👤</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Profile Not Found</h3>
          <p className="text-slate-600">Unable to load profile information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="px-8 py-6 space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">👤</span>
                <span>Profile Settings</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Your Profile
                </span>
              </h1>
              <p className="text-base text-slate-600">
                Manage your personal information and preferences
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                <span className="text-4xl">⚙️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden animate-slide-up">
          {/* Profile Header with Avatar */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="absolute -bottom-16 left-8 flex items-end gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden shadow-xl flex items-center justify-center">
                  {profile.profile_image_url ? (
                    <img 
                      src={profile.profile_image_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">👨‍🏫</span>
                  )}
                </div>
                {editMode && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="pb-4">
                <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                <p className="text-slate-600">{profile.department}</p>
              </div>
            </div>
            <div className="absolute top-4 right-6">
              {!editMode ? (
                <button 
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all border border-slate-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setEditMode(false);
                    setFormData(profile);
                  }}
                  className="flex items-center gap-2 bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-300 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 pt-20 space-y-6">
            
            {/* Contact Information Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Full Name
                  </label>
                  {!editMode ? (
                    <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-medium">
                      {profile.name}
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={formData.name || ""} 
                      onChange={e => handleChange("name", e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-slate-900 font-medium"
                      placeholder="Enter your name"
                    />
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-medium">
                    {profile.email}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                    Employee ID
                  </label>
                  <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-medium">
                    {profile.employee_id}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number
                  </label>
                  {!editMode ? (
                    <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-medium">
                      {profile.phone || "Not provided"}
                    </div>
                  ) : (
                    <input 
                      type="tel" 
                      value={formData.phone || ""} 
                      onChange={e => handleChange("phone", e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-slate-900 font-medium"
                      placeholder="+1 (555) 123-4567"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎓</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Professional Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Department
                  </label>
                  <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-medium">
                    {profile.department}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    Qualification
                  </label>
                  {!editMode ? (
                    <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-medium">
                      {profile.qualification || "Not provided"}
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={formData.qualification || ""} 
                      onChange={e => handleChange("qualification", e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-slate-900 font-medium"
                      placeholder="e.g., Ph.D. in Computer Science"
                    />
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Experience (Years)
                  </label>
                  {!editMode ? (
                    <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 font-medium">
                      {profile.experience_years || 0} years
                    </div>
                  ) : (
                    <input 
                      type="number" 
                      value={formData.experience_years || 0} 
                      onChange={e => handleChange("experience_years", Number(e.target.value))}
                      min="0"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-slate-900 font-medium"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📝</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">About</h3>
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Biography
                </label>
                {!editMode ? (
                  <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 min-h-[100px]">
                    {profile.bio || "No biography provided"}
                  </div>
                ) : (
                  <textarea 
                    value={formData.bio || ""} 
                    onChange={e => handleChange("bio", e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-slate-900 resize-none"
                    placeholder="Tell us about yourself, your teaching philosophy, and expertise..."
                  />
                )}
              </div>
            </div>

            {/* Save Button */}
            {editMode && (
              <div className="pt-6 border-t border-slate-200 flex gap-4 justify-end">
                <button 
                  onClick={() => {
                    setEditMode(false);
                    setFormData(profile);
                  }}
                  className="flex items-center gap-2 bg-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-xl hover:bg-slate-300 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
                <button 
                  onClick={saveChanges}
                  disabled={saving}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}
