// src/pages/UserProfilePage.js
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar, { SECTIONS } from '../components/profiles/Sidebar/Sidebar';
import ViewPublicProfile from '../components/profiles/UserProfile/ViewPublicProfile';
import EditProfile from '../components/profiles/UserProfile/EditProfile';
import EditPhoto from '../components/profiles/UserProfile/EditPhoto';
import ChangeCredentials from '../components/profiles/UserProfile/ChangeCredentials';
import SkillsAndProjects from '../components/profiles/UserProfile/SkillsAndProjects';
// Import placeholder components if needed
// import PrivacySecurity from '../components/UserProfile/PrivacySecurity';
// import MyPosts from '../components/UserProfile/MyPosts';
// import SavedItems from '../components/UserProfile/SavedItems';

import { getAccount } from '../services/api'; // Import API function
import './UserProfilePage.css';

const UserProfilePage = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.EDIT_PROFILE); // Default section
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user account data on mount
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getAccount();
      setUserData(response.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError('Could not load your profile data. Please try refreshing the page.');
      // Handle specific errors, e.g., redirect to login if 401 Unauthorized
      if (err.response && err.response.status === 401) {
          // redirect to login logic
          setError('Please log in to view your profile.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Handler to update user data locally after an update API call succeeds
   const handleProfileUpdate = (updatedData) => {
        setUserData(prevData => ({ ...prevData, ...updatedData }));
   };

   // Handler specifically for photo update
   const handlePhotoUpdate = (newImageUrl) => {
       setUserData(prevData => ({
           ...prevData,
           profile_image: newImageUrl // Assuming the API returns the updated profile with the new URL
       }));
   };

  const renderActiveSection = () => {
    if (isLoading) {
      return <div className="loading">Loading profile...</div>;
    }
    if (error) {
        return <div className="error-message main-error">{error}</div>;
    }
    if (!userData) {
        return <div className="loading">No user data found.</div>; // Or redirect
    }


    switch (activeSection) {
      case SECTIONS.VIEW_PUBLIC:
        // Pass the profile ID from the fetched userData
        return <ViewPublicProfile profileId={userData?.id} />;
      case SECTIONS.EDIT_PROFILE:
        return <EditProfile initialData={userData} onUpdateSuccess={handleProfileUpdate} />;
      case SECTIONS.EDIT_PHOTO:
         // Pass current image URL and update handler
        return <EditPhoto currentImageUrl={userData?.profile_image} onUpdateSuccess={handlePhotoUpdate}/>;
      case SECTIONS.CHANGE_CREDENTIALS:
        return <ChangeCredentials />; // Needs backend API endpoints
      case SECTIONS.SKILLS_PROJECTS:
        // Pass profile ID for fetching related skills/projects
        return <SkillsAndProjects profileId={userData?.id} />;
      case SECTIONS.PRIVACY:
         return <div className="section-container"><h2>Privacy & Security</h2><p>Section under construction.</p></div>; // Placeholder
       case SECTIONS.MY_POSTS:
         return <div className="section-container"><h2>My Posts</h2><p>Section under construction.</p></div>; // Placeholder
       case SECTIONS.SAVED:
         return <div className="section-container"><h2>Saved Items</h2><p>Section under construction.</p></div>; // Placeholder
      default:
        return <div className="section-container"><h2>Select an option</h2></div>;
    }
  };

  // Basic logout handler - adapt to your auth flow
  const handleLogout = () => {
      localStorage.removeItem('accessToken'); // Example: clear token
      localStorage.removeItem('refreshToken');
      // Redirect to login page
      window.location.href = '/login'; // Or use React Router's navigate
  };


  return (
    <div className="user-profile-page-container">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      <main className="profile-content-area">
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default UserProfilePage;