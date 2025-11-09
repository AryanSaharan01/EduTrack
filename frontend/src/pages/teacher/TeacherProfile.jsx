import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";

export default function TeacherProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    api.get("/teacher/profile")
      .then(res => {
        setProfile(res.data.teacher);
        setFormData(res.data.teacher);
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
      await api.put("/teacher/profile", formData);
      setProfile(formData);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <div className="page text-center">Loading profile...</div>;
  if (error) return <div className="page text-center text-red-600">{error}</div>;
  if (!profile) return <div className="page text-center text-red-600">Profile not found.</div>;

  return (
    <div className="page max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
      
      <div className="flex items-center space-x-6">
        <img 
          src={profile.profile_image_url || "/default-avatar.png"} 
          alt="Profile Avatar" 
          className="w-24 h-24 rounded-full object-cover"
        />
        {!editMode ? (
          <button className="btn-secondary" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">Name</label>
          {!editMode ? (
            <p className="mt-1 text-gray-900 dark:text-white">{profile.name}</p>
          ) : (
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => handleChange("name", e.target.value)}
              className="input mt-1 w-full"
            />
          )}
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">Email</label>
          <p className="mt-1 text-gray-900 dark:text-white">{profile.email}</p>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">Employee ID</label>
          <p className="mt-1 text-gray-900 dark:text-white">{profile.employee_id}</p>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">Phone</label>
          {!editMode ? (
            <p className="mt-1 text-gray-900 dark:text-white">{profile.phone}</p>
          ) : (
            <input 
              type="tel" 
              value={formData.phone} 
              onChange={e => handleChange("phone", e.target.value)}
              className="input mt-1 w-full"
            />
          )}
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">Department</label>
          <p className="mt-1 text-gray-900 dark:text-white">{profile.department}</p>
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">Qualification</label>
          {!editMode ? (
            <p className="mt-1 text-gray-900 dark:text-white">{profile.qualification}</p>
          ) : (
            <input 
              type="text" 
              value={formData.qualification} 
              onChange={e => handleChange("qualification", e.target.value)}
              className="input mt-1 w-full"
            />
          )}
        </div>

        <div>
          <label className="font-semibold text-gray-700 dark:text-gray-300">Experience (years)</label>
          {!editMode ? (
            <p className="mt-1 text-gray-900 dark:text-white">{profile.experience_years}</p>
          ) : (
            <input 
              type="number" 
              value={formData.experience_years} 
              onChange={e => handleChange("experience_years", Number(e.target.value))}
              min="0"
              className="input mt-1 w-full"
            />
          )}
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold text-gray-700 dark:text-gray-300">Bio</label>
          {!editMode ? (
            <p className="mt-1 text-gray-900 dark:text-white">{profile.bio}</p>
          ) : (
            <textarea 
              value={formData.bio} 
              onChange={e => handleChange("bio", e.target.value)}
              rows="4"
              className="input mt-1 w-full"
            />
          )}
        </div>
      </div>

      {editMode && (
        <button 
          className="btn-primary mt-4" 
          onClick={saveChanges}
        >
          Save Changes
        </button>
      )}
    </div>
  );
}
