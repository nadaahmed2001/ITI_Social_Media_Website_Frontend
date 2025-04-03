// import React, { useState, useEffect, useCallback } from 'react';
// import Sidebar, { SECTIONS } from '../components/profiles/Sidebar/Sidebar';
// import ViewPublicProfile from '../components/profiles/UserProfile/ViewPublicProfile';
// import EditProfile from '../components/profiles/UserProfile/EditProfile';
// import EditPhoto from '../components/profiles/UserProfile/EditPhoto';
// import ChangeCredentials from '../components/profiles/UserProfile/ChangeCredentials';
// import SkillsAndProjects from '../components/profiles/UserProfile/SkillsAndProjects';

// // TODO: PrivacySecurity, MyPosts, SavedItems
// // import PrivacySecurity from '../components/UserProfile/PrivacySecurity';
// // import MyPosts from '../components/UserProfile/MyPosts';
// // import SavedItems from '../components/UserProfile/SavedItems';

// import { getAccount } from '../services/api'; 
// import './UserProfilePage.css';

// const UserProfilePage = () => {
//   const [activeSection, setActiveSection] = useState(SECTIONS.EDIT_PROFILE); // Default section
//   const [userData, setUserData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch user account data on mount
//   const fetchUserData = useCallback(async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const response = await getAccount();
//       setUserData(response.data);
//     } catch (err) {
//       console.error("Failed to fetch user data:", err);
//       setError('Could not load your profile data. Please try refreshing the page.');
//       // Handle specific errors, e.g., redirect to login if 401 Unauthorized
//       if (err.response && err.response.status === 401) {
//           // redirect to login logic
//           setError('Please log in to view your profile.');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUserData();
//   }, [fetchUserData]);

//   // Handler to update user data locally after an update API call succeeds
//   const handleProfileUpdate = (updatedData) => {
//       setUserData(prevData => ({ ...prevData, ...updatedData }));
//   };

//    // Handler specifically for photo update
//   const handlePhotoUpdate = (newImageUrl) => {
//       setUserData(prevData => ({
//           ...prevData,
//           profile_image: newImageUrl // Assuming the API returns the updated profile with the new URL
//       }));
//   };

//   const renderActiveSection = () => {
//     if (isLoading) {
//       return <div className="loading">Loading profile...</div>;
//     }
//     if (error) {
//         return <div className="error-message main-error">{error}</div>;
//     }
//     if (!userData) {
//         return <div className="loading">No user data found.</div>; 
//     }


//     switch (activeSection) {
//       case SECTIONS.VIEW_PUBLIC:
//         // Pass the profile ID from the fetched userData
//         return <ViewPublicProfile profileId={userData?.id} />;
//       case SECTIONS.EDIT_PROFILE:
//         return <EditProfile initialData={userData} onUpdateSuccess={handleProfileUpdate} />;
//       case SECTIONS.EDIT_PHOTO:
//          // Pass current image URL and update handler
//         return <EditPhoto currentImageUrl={userData?.profile_image} onUpdateSuccess={handlePhotoUpdate}/>;
//       case SECTIONS.CHANGE_CREDENTIALS:
//         return <ChangeCredentials />; // Needs backend API endpoints
//       case SECTIONS.SKILLS_PROJECTS:
//         // Pass profile ID for fetching related skills/projects
//         return <SkillsAndProjects profileId={userData?.id} />;
//       case SECTIONS.PRIVACY:
//         return <div className="section-container"><h2>Privacy & Security</h2><p>Privacy & Security</p></div>;
//       case SECTIONS.MY_POSTS:
//         return <div className="section-container"><h2>My Posts</h2><p>My Posts.</p></div>; 
//       case SECTIONS.SAVED:
//         return <div className="section-container"><h2>Saved Posts</h2><p>Saved Posts.</p></div>; 
//       default:
//         return <div className="section-container"><h2>Select an option</h2></div>;
//     }
//   };

//   // Basic logout handler - adapt to your auth flow
//   const handleLogout = () => {
//       localStorage.removeItem('access_token'); 
//       localStorage.removeItem('refresh_token');
//       window.location.href = '/login'; 
//   };


//   return (
//     <div className="user-profile-page-container">
//       <Sidebar
//         activeSection={activeSection}
//         setActiveSection={setActiveSection}
//         onLogout={handleLogout}
//       />
//       <main className="profile-content-area">
//         {renderActiveSection()}
//       </main>
//     </div>
//   );
// };

// export default UserProfilePage;

// src/pages/UserProfilePage.jsx (Adjust path if necessary)
import React, { useState, useEffect, useCallback } from 'react';

// --- Verify Component Import Paths ---
import Sidebar, { SECTIONS } from '../components/profiles/Sidebar/Sidebar'; // Adjust path if needed
import ViewPublicProfile from '../components/profiles/UserProfile/ViewPublicProfile'; // Adjust path if needed
import EditProfile from '../components/profiles/UserProfile/EditProfile'; // Adjust path if needed
import EditPhoto from '../components/profiles/UserProfile/EditPhoto'; // Adjust path if needed
import ChangeCredentials from '../components/profiles/UserProfile/ChangeCredentials'; // Adjust path if needed
import SkillsAndProjects from '../components/profiles/UserProfile/SkillsAndProjects'; // Adjust path if needed
// --- End Path Verification ---

// TODO: Implement these components later
// import PrivacySecurity from '../components/UserProfile/PrivacySecurity';
// import MyPosts from '../components/UserProfile/MyPosts';
// import SavedItems from '../components/UserProfile/SavedItems';

// --- Verify API Import Path ---
import { getAccount } from '../services/api'; // Adjust path if needed
// --- End Path Verification ---

import './UserProfilePage.css'; // Ensure this CSS file exists and is correct

const UserProfilePage = () => {
  const [activeSection, setActiveSection] = useState(SECTIONS.EDIT_PROFILE); // Default section
  // userData will hold the data returned by getAccount (expected to be Profile data now)
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user account data (Profile data) on mount
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // getAccount should hit GET /users/account/ which returns ProfileSerializer data
      const response = await getAccount();
      setUserData(response.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      let errorMsg = 'Could not load your profile data. Please try refreshing the page.';
      // Handle specific errors, e.g., redirect to login if 401 Unauthorized
      if (err.response && err.response.status === 401) {
          errorMsg = 'Authentication failed. Please log in again.';
          // Optional: Implement actual redirect logic here or in an Axios interceptor
          // window.location.href = '/login';
      }
      setError(errorMsg);
      setUserData(null); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed if it always fetches the logged-in user's data

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); // Run on mount

  // Callback for EditProfile component to update general user data
  const handleProfileUpdate = (updatedData) => {
      setUserData(prevData => ({
          ...prevData, // Keep existing data
          ...updatedData // Merge in updated fields
        }));
  };

   // Callback for EditPhoto component to update only the profile image URL
  const handlePhotoUpdate = (newImageUrl) => {
      console.log("handlePhotoUpdate received newImageUrl:", newImageUrl);
      setUserData(prevData => {
          if (!prevData) return null; // Should not happen if called after load
          
          const updatedData = {
            ...prevData,
            profile_image: newImageUrl // Update the specific profile_image field
          };
          // --- ADD LOG ---
          console.log("UserProfilePage state updated with:", updatedData);
          // --- END LOG ---

          return updatedData;

          // return {
          //   ...prevData,
          //   profile_image: newImageUrl // Update the specific profile_image field
          // };
      });
  };

  // Renders the currently selected content section
  const renderActiveSection = () => {
    // Loading State
    if (isLoading) {
      return <div className="loading">Loading profile...</div>;
    }
    // Critical Error State (failed to load profile data at all)
    if (error && !userData) {
        return <div className="error-message main-error">{error}</div>;
    }
    // Should ideally not happen if isLoading is false and no error, but safety check
    if (!userData) {
        return <div className="loading">No user data found.</div>;
    }

    // Non-critical Error Display (e.g., if profile loaded but something else failed later)
    // Can be placed inside the main container below if preferred
    // {error && <div className="error-message">{error}</div>}

    switch (activeSection) {
      case SECTIONS.VIEW_PUBLIC:
        // Assumes userData IS the profile data, and userData.id is the Profile's UUID
        // Adjust if getAccount returns user object separately from profile object
        return <ViewPublicProfile profileId={userData?.id} />;
      case SECTIONS.EDIT_PROFILE:
        // Pass the full userData (profile data) to EditProfile
        return <EditProfile initialData={userData} onUpdateSuccess={handleProfileUpdate} />;
      case SECTIONS.EDIT_PHOTO:
         // Pass the profile_image URL (now from Profile model) and the update handler
        return <EditPhoto currentImageUrl={userData?.profile_image} onUpdateSuccess={handlePhotoUpdate}/>;
      case SECTIONS.CHANGE_CREDENTIALS:
        // This component handles its own state and API calls
        return <ChangeCredentials />;
      case SECTIONS.SKILLS_PROJECTS:
        // Assumes SkillsAndProjects needs the Profile ID to fetch related items
        return <SkillsAndProjects profileId={userData?.id} />;
      // --- Placeholder sections ---
      case SECTIONS.PRIVACY:
        return <div className="section-container"><h2>Privacy & Security</h2><p>Content for Privacy & Security goes here.</p></div>;
      case SECTIONS.MY_POSTS:
        return <div className="section-container"><h2>My Posts</h2><p>Content for My Posts goes here.</p></div>;
      case SECTIONS.SAVED:
        return <div className="section-container"><h2>Saved Items</h2><p>Content for Saved Items goes here.</p></div>;
      // --- End Placeholders ---
      default:
        // Fallback if activeSection is invalid
        console.warn("Invalid section selected:", activeSection);
        // Redirect to default or show message
        // setActiveSection(SECTIONS.EDIT_PROFILE); // Option: reset to default
        return <div className="section-container"><h2>Select an option</h2></div>;
    }
  };

  // Handles user logout
  const handleLogout = () => {
      // --- Verify these localStorage keys match what you use for storing tokens ---
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // --- End Verification ---
      // Redirect to login page after clearing tokens
      window.location.href = '/login'; // Use React Router navigate() for SPA navigation if preferred
  };


  // --- Main Component Return ---
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