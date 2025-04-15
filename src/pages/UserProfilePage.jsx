import React, { useState, useEffect, useCallback, useContext } from 'react'; // Added useContext
import Sidebar, { SECTIONS } from '../components/profiles/Sidebar/Sidebar';
import ViewPublicProfile from '../components/profiles/UserProfile/ViewPublicProfile';
import EditProfile from '../components/profiles/UserProfile/EditProfile';
import EditPhoto from '../components/profiles/UserProfile/EditPhoto';
import ChangeCredentials from '../components/profiles/UserProfile/ChangeCredentials';
import SkillsAndProjects from '../components/profiles/UserProfile/SkillsAndProjects';
import PrivacySecuritySettings from '../components/profiles/UserProfile/PrivacySecuritySettings';
import SavedPosts from '../components/profiles/UserProfile/SavedPosts'; // *** IMPORT THE NEW COMPONENT ***
import AuthContext from '../contexts/AuthContext'; // Import AuthContext if needed for other sections

import { getAccount } from '../components/services/api'; // Keep if needed for other sections

import './UserProfilePage.css'; // Keep your page-level styles

const UserProfilePage = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.EDIT_PROFILE); // Default section
  const { user: contextUser, loading: authLoading } = useContext(AuthContext); // Get context user

  // State for the main profile data (if needed by other sections like EditProfile)
  const [userData, setUserData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true); // Renamed for clarity
  const [profileError, setProfileError] = useState(''); // Renamed for clarity

  // Fetch user account data (Profile data) on mount - Keep this if EditProfile needs it
  const fetchUserData = useCallback(async () => {
    setIsLoadingProfile(true);
    setProfileError('');
    try {
      // Assuming getAccount fetches the profile data for the logged-in user
      const response = await getAccount();
      console.log("API Response from UserProfilePage.jsx:", response);
      setUserData(response.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      let errorMsg = 'Could not load your profile data.';
      if (err.response && err.response.status === 401) {
          errorMsg = 'Authentication failed. Please log in again.';
          // Optional: Redirect logic
      }
      setProfileError(errorMsg);
      setUserData(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    // Fetch profile data needed for sections other than 'Saved'
    // SavedPosts component fetches its own data
    if (activeSection !== SECTIONS.SAVED) {
        fetchUserData();
    }
  }, [fetchUserData, activeSection]); // Re-fetch if section changes away from 'Saved'


  // Callbacks for updating profile data from child components (keep if needed)
  const handleProfileUpdate = (updatedData) => {
      setUserData(prevData => ({ ...prevData, ...updatedData }));
  };
  const handlePhotoUpdate = (newImageUrl) => {
      setUserData(prevData => ({ ...prevData, profile_image: newImageUrl })); // Adjust field name if needed
  };


  // Renders the currently selected content section
  const renderActiveSection = () => {
    // Handle loading/error for the main profile data needed by *other* sections
    if (isLoadingProfile && activeSection !== SECTIONS.SAVED) {
      return <div className="loading">Loading profile...</div>; // Or a spinner
    }
    if (profileError && activeSection !== SECTIONS.SAVED && !userData) {
        return <div className="mt-[100px] error-message main-error">{profileError}</div>;
    }
    // If user data is needed but not available (and not loading/error)
    if (!userData && activeSection !== SECTIONS.SAVED) {
         return <div className="loading">Could not load user data for this section.</div>;
    }


    switch (activeSection) {
      case SECTIONS.VIEW_PUBLIC:
        return <ViewPublicProfile profileId={userData?.id} />;
      case SECTIONS.EDIT_PROFILE:
        return <EditProfile initialData={userData} onUpdateSuccess={handleProfileUpdate} />;
      case SECTIONS.EDIT_PHOTO:
        return <EditPhoto currentImageUrl={userData?.profile_image} onUpdateSuccess={handlePhotoUpdate}/>;
      case SECTIONS.CHANGE_CREDENTIALS:
        return <ChangeCredentials />;
      case SECTIONS.SKILLS_PROJECTS:
        return <SkillsAndProjects profileId={userData?.id} />;
      case SECTIONS.PRIVACY:
        return <PrivacySecuritySettings userData={userData} onUpdateUserData={handleProfileUpdate} />;
      case SECTIONS.MY_POSTS:
        // return <MyPostsComponent />; // Implement this component separately
        return <Typography>My Posts Section (To be implemented)</Typography>;

      // --- SAVED POSTS SECTION ---
      case SECTIONS.SAVED:
        // Simply render the new SavedPosts component
        // It handles its own fetching, loading, error, and display states
        return <SavedPosts />;
      // --- END SAVED POSTS SECTION ---

      default:
        console.warn("Invalid section selected:", activeSection);
        // Maybe default to Edit Profile if section is unknown
        return <EditProfile initialData={userData} onUpdateSuccess={handleProfileUpdate} />;
    }
  };

  // Handles user logout (no changes needed)
  const handleLogout = () => { /* ... */ };


  // --- Main Component Return ---
  return (
    <div className="user-profile-page-container"> {/* Ensure this class provides layout */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      <main className="profile-content-area"> {/* Ensure this class provides layout */}
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default UserProfilePage;
