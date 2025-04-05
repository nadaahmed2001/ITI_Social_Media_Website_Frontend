// import React, { useState, useEffect, useCallback } from 'react';
// import Sidebar, { SECTIONS } from '../components/profiles/Sidebar/Sidebar'; 
// import ViewPublicProfile from '../components/profiles/UserProfile/ViewPublicProfile';
// import EditProfile from '../components/profiles/UserProfile/EditProfile'; 
// import EditPhoto from '../components/profiles/UserProfile/EditPhoto';
// import ChangeCredentials from '../components/profiles/UserProfile/ChangeCredentials'; 
// import SkillsAndProjects from '../components/profiles/UserProfile/SkillsAndProjects';
// import PrivacySecuritySettings from '../components/profiles/UserProfile/PrivacySecuritySettings'; 

// // TODO: Implement these components later
// // import PrivacySecurity from '../components/UserProfile/PrivacySecurity';
// // import MyPosts from '../components/UserProfile/MyPosts';
// // import SavedItems from '../components/UserProfile/SavedItems';

// import { getAccount } from '../services/api'; 
// // --- End Path Verification ---

// import './UserProfilePage.css';

// const UserProfilePage = () => {
//   const [activeSection, setActiveSection] = useState(SECTIONS.EDIT_PROFILE);
//   // userData will hold the data returned by getAccount (expected to be Profile data now)
//   const [userData, setUserData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch user account data (Profile data) on mount
//   const fetchUserData = useCallback(async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const response = await getAccount();
//       setUserData(response.data);
//     } catch (err) {
//       console.error("Failed to fetch user data:", err);
//       let errorMsg = 'Could not load your profile data. Please try refreshing the page.';
//       if (err.response && err.response.status === 401) {
//           errorMsg = 'Authentication failed. Please log in again.';
//           // Optional: Implement actual redirect logic here or in an Axios interceptor
//           // window.location.href = '/login';
//       }
//       setError(errorMsg);
//       setUserData(null); // Clear data on error
//     } finally {
//       setIsLoading(false);
//     }
//   }, []); 

//   useEffect(() => {
//     fetchUserData();
//   }, [fetchUserData]); // Run on mount

//   // Callback for EditProfile component to update general user data
//   const handleProfileUpdate = (updatedData) => {
//       setUserData(prevData => ({
//           ...prevData, // Keep existing data
//           ...updatedData // Merge in updated fields
//         }));
//   };

//    // Callback for EditPhoto component to update only the profile image URL
//   const handlePhotoUpdate = (newImageUrl) => {
//       console.log("handlePhotoUpdate received newImageUrl:", newImageUrl);
//       setUserData(prevData => {
//           if (!prevData) return null; // Should not happen if called after load
          
//           const updatedData = {
//             ...prevData,
//             profile_image: newImageUrl // Update the specific profile_image field
//           };
//           console.log("UserProfilePage state updated with:", updatedData);

//           return updatedData;

  
//       });
//   };

//   // Renders the currently selected content section
//   const renderActiveSection = () => {
//     // Loading State
//     if (isLoading) {
//       return <div className="loading">Loading profile...</div>;
//     }
//     // Critical Error State (failed to load profile data at all)
//     if (error && !userData) {
//         return <div className="error-message main-error">{error}</div>;
//     }
//     // Should ideally not happen if isLoading is false and no error, but safety check
//     if (!userData) {
//         return <div className="loading">No user data found.</div>;
//     }

//     // Non-critical Error Display (e.g., if profile loaded but something else failed later)
//     // Can be placed inside the main container below if preferred
//     // {error && <div className="error-message">{error}</div>}

//     switch (activeSection) {
//       case SECTIONS.VIEW_PUBLIC:
//         // Assumes userData IS the profile data, and userData.id is the Profile's UUID
//         // Adjust if getAccount returns user object separately from profile object
//         return <ViewPublicProfile profileId={userData?.id} />;
//       case SECTIONS.EDIT_PROFILE:
//         // Pass the full userData (profile data) to EditProfile
//         return <EditProfile initialData={userData} onUpdateSuccess={handleProfileUpdate} />;
//       case SECTIONS.EDIT_PHOTO:
//          // Pass the profile_image URL (now from Profile model) and the update handler
//         return <EditPhoto currentImageUrl={userData?.profile_image} onUpdateSuccess={handlePhotoUpdate}/>;
//       case SECTIONS.CHANGE_CREDENTIALS:
//         // This component handles its own state and API calls
//         return <ChangeCredentials />;
//       case SECTIONS.SKILLS_PROJECTS:
//         // Assumes SkillsAndProjects needs the Profile ID to fetch related items
//         return <SkillsAndProjects profileId={userData?.id} />;

//       case SECTIONS.PRIVACY:
//         return <PrivacySecuritySettings userData={userData} onUpdateUserData={handleProfileUpdate} />;
//       case SECTIONS.MY_POSTS:
//         return <div className="section-container"><h2>My Posts</h2><p>Content for My Posts goes here.</p></div>;
//       case SECTIONS.SAVED:
//         return <div className="section-container"><h2>Saved Items</h2><p>Content for Saved Items goes here.</p></div>;
//       // --- End Placeholders ---
//       default:
//         // Fallback if activeSection is invalid
//         console.warn("Invalid section selected:", activeSection);
//         // Redirect to default or show message
//         // setActiveSection(SECTIONS.EDIT_PROFILE); // Option: reset to default
//         return <div className="section-container"><h2>Select an option</h2></div>;
//     }
//   };

//   // Handles user logout
//   const handleLogout = () => {
//       // --- Verify these localStorage keys match what you use for storing tokens ---
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       // --- End Verification ---
//       // Redirect to login page after clearing tokens
//       window.location.href = '/login'; // Use React Router navigate() for SPA navigation if preferred
//   };


//   // --- Main Component Return ---
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

// src/pages/UserProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';

// Import Tailwind-styled Sidebar
import Sidebar, { SECTIONS } from '../components/profiles/Sidebar/Sidebar'; // Adjust path

// Import other Tailwind-styled content components (will be created/updated)
import ViewPublicProfile from '../components/profiles/UserProfile/ViewPublicProfile';
import EditProfile from '../components/profiles/UserProfile/EditProfile'; // Need to rewrite this with Tailwind
import EditPhoto from '../components/profiles/UserProfile/EditPhoto'; // Need to rewrite this with Tailwind
import ChangeCredentials from '../components/profiles/UserProfile/ChangeCredentials'; // Need to rewrite this with Tailwind
import SkillsAndProjects from '../components/profiles/UserProfile/SkillsAndProjects'; // Need to rewrite this with Tailwind
import PrivacySecuritySettings from '../components/profiles/UserProfile/PrivacySecuritySettings'; // Need to rewrite this with Tailwind
// Placeholder components for sections not yet implemented
const PlaceholderSection = ({ title }) => (
    <div className="p-6 border border-gray-200 rounded-md bg-white"> {/* Example basic container */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600">Content for {title} goes here.</p>
    </div>
);


import { getAccount } from '../services/api'; // Adjust path
// Remove UserProfilePage.css if styles are now handled by Tailwind utilities
// import './UserProfilePage.css';

const UserProfilePage = () => {
  // Default to EDIT_PROFILE based on example screenshot active state
  const [activeSection, setActiveSection] = useState(SECTIONS.EDIT_PROFILE);
  const [userData, setUserData] = useState(null); // Holds Profile data including 2FA status, image URL etc.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Data Fetching ---
  const fetchUserData = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const response = await getAccount();
      setUserData(response.data);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError('Could not load profile data.');
      if (err.response && err.response.status === 401) { setError('Please log in.'); }
      setUserData(null);
    } finally { setIsLoading(false); }
  }, []);
  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  // --- Update Handlers ---
  // General handler to merge updates into userData state
  const handleProfileUpdate = (updatedData) => {
      setUserData(prevData => ({ ...prevData, ...updatedData }));
      // Optionally show a temporary success message here
  };
  // Specific handler for photo update (might be redundant if handleProfileUpdate handles all fields)
//   const handlePhotoUpdate = (newImageUrl) => {
//       setUserData(prevData => ({ ...prevData, profile_picture: newImageUrl })); // Use correct field name
//   };


  // --- Section Rendering ---
  const renderActiveSection = () => {
    // Use loading state BEFORE checking userData
    if (isLoading) {
      return <div className="p-6 text-center text-gray-500">Loading profile...</div>;
    }
    // Handle critical error where no user data could be fetched
    if (error && !userData) {
        return <div className="p-6 text-center text-red-600 bg-red-100 border border-red-400 rounded-md">{error}</div>;
    }
    // Handle case where loading finished but data is somehow still null
    if (!userData) {
        return <div className="p-6 text-center text-gray-500">No user data found.</div>;
    }

    // Render the active component, passing necessary data
    switch (activeSection) {
      case SECTIONS.VIEW_PUBLIC:
        // ViewPublicProfile needs to be rewritten with Tailwind
        return <ViewPublicProfile profileId={userData?.id} />; // Assuming userData.id IS profile ID
      case SECTIONS.EDIT_PROFILE:
        // EditProfile needs rewrite with Tailwind
        return <EditProfile initialData={userData} onUpdateSuccess={handleProfileUpdate} />;
      case SECTIONS.EDIT_PHOTO:
         // EditPhoto needs rewrite with Tailwind
        return <EditPhoto currentImageUrl={userData?.profile_picture} onUpdateSuccess={handleProfileUpdate}/>; // Pass profile_picture, use general update handler
      case SECTIONS.CHANGE_CREDENTIALS:
         // ChangeCredentials needs rewrite with Tailwind
        return <ChangeCredentials />;
      case SECTIONS.SKILLS_PROJECTS:
        // SkillsAndProjects needs rewrite with Tailwind
        return <SkillsAndProjects profileId={userData?.id} />;
      case SECTIONS.PRIVACY: // Maps to "Privacy"
         // PrivacySecuritySettings needs rewrite with Tailwind
        return <PrivacySecuritySettings userData={userData} onUpdateUserData={handleProfileUpdate} />;
      case SECTIONS.ACCOUNT_SECURITY: // Keep if distinct from credentials
         return <PlaceholderSection title="Account Security" />; // Placeholder
      case SECTIONS.SUBSCRIPTIONS: return <PlaceholderSection title="Subscriptions" />;
      case SECTIONS.PAYMENT_METHODS: return <PlaceholderSection title="Payment methods" />;
      case SECTIONS.NOTIFICATIONS: return <PlaceholderSection title="Notification Preferences" />;
      case SECTIONS.API_CLIENTS: return <PlaceholderSection title="API clients" />;
      case SECTIONS.CLOSE_ACCOUNT: return <PlaceholderSection title="Close account" />;
      case SECTIONS.MY_POSTS: return <PlaceholderSection title="My Posts" />;
      case SECTIONS.SAVED: return <PlaceholderSection title="Saved Items" />;
      default:
        console.warn("Invalid section:", activeSection);
        // Maybe default to Edit Profile view
        return <EditProfile initialData={userData} onUpdateSuccess={handleProfileUpdate} />;
    }
  };

  // --- Logout Handler ---
  const handleLogout = () => {
      console.log("Logging out...");
      localStorage.removeItem('access_token'); // Use correct key
      localStorage.removeItem('refresh_token'); // Use correct key
      window.location.href = '/login'; // Simple redirect
  };

  // --- Main Return ---
  return (
    // Assumes parent div#webcrumbs exists if using important: '#webcrumbs' in Tailwind config
    // Or remove that config and this wrapper isn't needed
    <div id="webcrumbs">
        {/* Use theme background defined in global CSS/Tailwind config */}
        <div className="min-h-screen bg-gray-100 font-sans"> {/* Example light grey background */}
            {/* Header Placeholder - Replace with your actual Header component if needed */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="text-lg font-bold">ITI Hub</div> {/* Simple Header */}
                    {/* Add ThemeToggle here */}
                    {/* <ThemeToggle /> */}
                    {/* Add other header items like search, nav links if needed */}
                </div>
            </header>

            {/* Main Content Area using Flexbox */}
            {/* Centered container */}
            <main className="container mx-auto px-4 py-8">
                 {/* Flex container for sidebar + content */}
                <div className="flex flex-col md:flex-row md:space-x-6"> {/* Stack on mobile, row on medium+ */}

                    {/* Sidebar */}
                    <aside className="w-full md:w-72 mb-6 md:mb-0 flex-shrink-0">
                        <Sidebar
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                            userData={userData} // Pass user data to sidebar
                            onLogout={handleLogout}
                        />
                    </aside>

                    {/* Content Area */}
                    <section className="flex-1">
                        {renderActiveSection()}
                    </section>

                </div>
            </main>
        </div>
    </div>
  );
};

export default UserProfilePage;