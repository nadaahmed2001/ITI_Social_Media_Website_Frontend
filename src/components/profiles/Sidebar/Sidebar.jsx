// // src/components/Sidebar/Sidebar.js
// import React from "react";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import EditIcon from "@mui/icons-material/Edit";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import VpnKeyIcon from "@mui/icons-material/VpnKey"; // Use for Change Credentials
// import BuildIcon from "@mui/icons-material/Build";
// import SecurityIcon from "@mui/icons-material/Security";
// import LogoutIcon from "@mui/icons-material/Logout";
// import SearchSharpIcon from '@mui/icons-material/SearchSharp';
// import BookmarkSharpIcon from '@mui/icons-material/BookmarkSharp';
// import FeedIcon from '@mui/icons-material/Feed';
// import EmailIcon from '@mui/icons-material/Email'; // Added for Change Email/Password
// import "./Sidebar.css"; // Your CSS file

// // Define keys for sections
// export const SECTIONS = {
//   VIEW_PUBLIC: 'viewPublicProfile',
//   EDIT_PROFILE: 'editProfile',
//   EDIT_PHOTO: 'editPhoto',
//   CHANGE_CREDENTIALS: 'changeCredentials',
//   SKILLS_PROJECTS: 'skillsProjects',
//   PRIVACY: 'privacy', 
//   MY_POSTS: 'myPosts',
//   SAVED: 'saved', 
// };


// export default function Sidebar({ activeSection, setActiveSection, onLogout }) {
//   const handleLogout = () => {
//       localStorage.removeItem('access_token'); 
//       localStorage.removeItem('refresh_token');
//       window.location.href = '/login'; 

//     console.log("Logout clicked");
//     if (onLogout) {
//         onLogout();
//     }
//   };

//   // Helper to create sidebar options
//   const SidebarOption = ({ sectionKey, icon, label }) => (
//     <div
//       className={`sidebar-option ${activeSection === sectionKey ? 'active' : ''}`}
//       onClick={() => setActiveSection(sectionKey)}
//     >
//       {icon}
//       <span>{label}</span>
//     </div>
//   );


//   return (
//     <div className="sidebar-container">
//       <div className="search-bar">
//         <SearchSharpIcon className="search-icon" />
//         <input type="text" placeholder="Search settings" />
//       </div>

//       <SidebarOption sectionKey={SECTIONS.VIEW_PUBLIC} icon={<AccountCircleIcon className="icon" />} label="View Public Profile" />
//       <SidebarOption sectionKey={SECTIONS.EDIT_PROFILE} icon={<EditIcon className="icon" />} label="Edit Profile" />
//       <SidebarOption sectionKey={SECTIONS.EDIT_PHOTO} icon={<PhotoCameraIcon className="icon" />} label="Photo" />
//       <SidebarOption sectionKey={SECTIONS.CHANGE_CREDENTIALS} icon={<VpnKeyIcon className="icon" />} label="Change Email/Password" />
//       <SidebarOption sectionKey={SECTIONS.SKILLS_PROJECTS} icon={<BuildIcon className="icon" />} label="Skills & Projects" />
//       <SidebarOption sectionKey={SECTIONS.PRIVACY} icon={<SecurityIcon className="icon" />} label="Privacy and Security" />
//       <SidebarOption sectionKey={SECTIONS.MY_POSTS} icon={<FeedIcon className="icon" />} label="My Posts" />
//       <SidebarOption sectionKey={SECTIONS.SAVED} icon={<BookmarkSharpIcon className="icon" />} label="Saved" />

//       {/* Logout */}
//       <div className="sidebar-option logout" onClick={handleLogout}>
//         <LogoutIcon className="icon" />
//         <span>Logout</span>
//       </div>
//     </div>
//   );
// }

// src/components/profiles/Sidebar/Sidebar.jsx (Adjust path)
import React from 'react';
// Define SECTIONS object here or import it
export const SECTIONS = {
  VIEW_PUBLIC: 'viewPublicProfile',
  EDIT_PROFILE: 'editProfile', // Changed key to match typical usage
  EDIT_PHOTO: 'editPhoto',     // Changed key
  CHANGE_CREDENTIALS: 'changeCredentials', // Or 'accountSecurity'
  SKILLS_PROJECTS: 'skillsProjects',
  PRIVACY: 'privacy',
  // Add keys for other items shown in example if needed
  SUBSCRIPTIONS: 'subscriptions',
  PAYMENT_METHODS: 'paymentMethods',
  NOTIFICATIONS: 'notifications',
  API_CLIENTS: 'apiClients',
  CLOSE_ACCOUNT: 'closeAccount',
  // Add keys from previous dark theme if still needed
  MY_POSTS: 'myPosts',
  SAVED: 'saved',
};


// Assuming userData (with name, headline, picture) and onLogout are passed as props
const Sidebar = ({ activeSection, setActiveSection, userData, onLogout }) => {

  // Define sidebar navigation items based on example + previous items
  // Use the SECTIONS keys
  const navItems = [
    // { key: SECTIONS.VIEW_PUBLIC, label: 'View public profile' }, // This was a button in example, handle separately
    { key: SECTIONS.EDIT_PROFILE, label: 'Profile' }, // "Profile" seems to map to Edit Profile
    { key: SECTIONS.EDIT_PHOTO, label: 'Photo' },
    { key: SECTIONS.CHANGE_CREDENTIALS, label: 'Account Security' }, // Mapping "Account Security"
    { key: SECTIONS.SKILLS_PROJECTS, label: 'Skills & Projects' }, // Keep this one
    // Add items from the light theme example:
    { key: SECTIONS.PRIVACY, label: 'Privacy' },
    // { key: SECTIONS.NOTIFICATIONS, label: 'Notification Preferences' },
     // Add back My Posts / Saved if still needed
    { key: SECTIONS.MY_POSTS, label: 'Your Posts' },
    { key: SECTIONS.SAVED, label: 'Saved Posts' },
    // Add Close Account last
    { key: SECTIONS.LOGOUT, label: 'Logout' },
  ];

  const handleNavClick = (sectionKey) => {
      // Add logic here if certain items navigate away instead of just setting active section
      // For now, assume they all just change the active section
      setActiveSection(sectionKey);
      // Special case for logout? Or handle via dedicated button if needed.
      if (sectionKey === 'logout') {
          handleLogoutClick();
      }
  }

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Get initials for avatar placeholder
  const getInitials = (firstName = '', lastName = '') => {
    const fn = firstName?.[0]?.toUpperCase() || '';
    const ln = lastName?.[0]?.toUpperCase() || '';
    return fn + ln || '??';
  }

  return (
    // Sidebar container div - match example width, border, rounded, etc.
    // Use h-screen or similar if it needs full height independent of content
    <div className="w-72 bg-white border border-gray-200 rounded-md overflow-hidden flex-shrink-0"> {/* Use flex-shrink-0 */}
      {/* Profile Info Section */}
      <div className="p-6 flex flex-col items-center border-b border-gray-200">
        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
          {/* TODO: Replace with actual image if available */}
          {userData?.profile_picture ? (
             <img src={userData.profile_picture} alt="Profile" className="w-full h-full object-cover rounded-full" />
          ) : (
             <span>{getInitials(userData?.first_name, userData?.last_name)}</span>
          )}
        </div>
        <h2 className="font-medium text-gray-900 text-lg">{userData?.first_name || userData?.last_name ? `${userData.first_name} ${userData.last_name}` : userData?.username}</h2>
        {userData?.headline && <p className="text-sm text-gray-500 text-center mt-1">{userData.headline}</p>}
        {/* "View public profile" button - might navigate or set specific section */}
        <button
            onClick={() => handleNavClick(SECTIONS.VIEW_PUBLIC)}
            className={`mt-3 text-sm font-medium transition-colors ${
                activeSection === SECTIONS.VIEW_PUBLIC
                ? 'text-primary-700' // Example active style for this one
                : 'text-primary-600 hover:text-primary-700'
            }`}
        >
           View public profile
        </button>
      </div>

      {/* Navigation Links Section */}
      {/* The example had bg-primary-50, maybe use bg-neutral-50 or just white */}
      <div className="bg-neutral-50"> {/* Using neutral color from theme */}
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => handleNavClick(item.key)}
            // Apply conditional styling for active item
            className={`w-full py-3 px-4 text-left text-sm font-medium transition-colors duration-150 ${
              activeSection === item.key
                ? 'bg-primary-100 text-primary-800 border-l-4 border-primary-600 font-semibold' // Active style from example
                : 'text-gray-700 hover:bg-gray-100' // Inactive style
            }`}
          >
            {item.label}
          </button>
        ))}
         {/* Optional: Separate Logout Button if not in navItems */}
         {/* <button onClick={handleLogoutClick} className="w-full py-3 px-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 border-t border-gray-200">Logout</button> */}
      </div>
    </div>
  );
};

export default Sidebar; // Make sure to export default or named as needed