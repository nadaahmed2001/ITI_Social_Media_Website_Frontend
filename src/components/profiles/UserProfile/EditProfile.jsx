// src/components/UserProfile/EditProfile.js
import React, { useState, useEffect } from 'react';
import { updateAccount } from '../../../services/api';
import EditIcon from '@mui/icons-material/Edit';
import './EditProfile.css'; // Create this CSS file

const EditProfile = ({ initialData, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    headline: '',
    bio: '',
    github_url: '',
    leetcode_username: '',
    linkedin_url: '',
    hackerrank_username: '',
    website_url: '', 
    location: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (initialData) {
        // Populate form only with fields present in initialData
        const initialFormData = {};
        for (const key in formData) {
            if (initialData.hasOwnProperty(key)) {
                initialFormData[key] = initialData[key] || ''; // Use empty string if null/undefined
            }
        }
        setFormData(prev => ({ ...prev, ...initialFormData }));
    }
  }, [initialData]); // Rerun when initialData changes


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error on change
    setSuccess(''); // Clear success on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateAccount(formData);
      setSuccess('Profile updated successfully!');
      if (onUpdateSuccess) {
        onUpdateSuccess(response.data); // Pass updated data back to parent
      }
    } catch (err) {
      console.error("Profile update error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for input fields
  const renderInput = (name, label, type = 'text') => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <div className="edit-profile-container section-container">
      <h2><EditIcon /> Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="form-section">
          <h3>Basic Info</h3>
          {renderInput('first_name', 'First Name')}
          {renderInput('last_name', 'Last Name')}
          {renderInput('headline', 'Headline')}
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              disabled={isLoading}
            />
          </div>
          {renderInput('location', 'Location')}
        </div>

        <div className="form-section">
          <h3>Links</h3>
          {renderInput('github_url', 'GitHub Profile URL')}
          {renderInput('leetcode_username', 'LeetCode Username')}
          {renderInput('linkedin_url', 'LinkedIn Profile URL')}
          {renderInput('hackerrank_username', 'HackerRank Username')}
          {renderInput('website_url', 'Personal Portfolio URL')}
           {/* Add other links like twitter_url, stackoverflow_url if needed */}
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;