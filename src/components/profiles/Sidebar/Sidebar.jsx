// src/components/Sidebar/Sidebar.js
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VpnKeyIcon from "@mui/icons-material/VpnKey"; // Use for Change Credentials
import BuildIcon from "@mui/icons-material/Build";
import SecurityIcon from "@mui/icons-material/Security";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import BookmarkSharpIcon from '@mui/icons-material/BookmarkSharp';
import FeedIcon from '@mui/icons-material/Feed';
import EmailIcon from '@mui/icons-material/Email'; // Added for Change Email/Password
import "./Sidebar.css"; // Your CSS file

// Define keys for sections
export const SECTIONS = {
  VIEW_PUBLIC: 'viewPublicProfile',
  EDIT_PROFILE: 'editProfile',
  EDIT_PHOTO: 'editPhoto',
  CHANGE_CREDENTIALS: 'changeCredentials',
  SKILLS_PROJECTS: 'skillsProjects',
  PRIVACY: 'privacy', 
  MY_POSTS: 'myPosts',
  SAVED: 'saved', 
};


export default function Sidebar({ activeSection, setActiveSection, onLogout }) {
  const handleLogout = () => {
      localStorage.removeItem('access_token'); 
      localStorage.removeItem('refresh_token');
      window.location.href = '/login'; 

    console.log("Logout clicked");
    if (onLogout) {
        onLogout();
    }
  };

  // Helper to create sidebar options
  const SidebarOption = ({ sectionKey, icon, label }) => (
    <div
      className={`sidebar-option ${activeSection === sectionKey ? 'active' : ''}`}
      onClick={() => setActiveSection(sectionKey)}
    >
      {icon}
      <span>{label}</span>
    </div>
  );


  return (
    <div className="sidebar-container">
      <div className="search-bar">
        <SearchSharpIcon className="search-icon" />
        <input type="text" placeholder="Search settings" />
      </div>

      <SidebarOption sectionKey={SECTIONS.VIEW_PUBLIC} icon={<AccountCircleIcon className="icon" />} label="View Public Profile" />
      <SidebarOption sectionKey={SECTIONS.EDIT_PROFILE} icon={<EditIcon className="icon" />} label="Edit Profile" />
      <SidebarOption sectionKey={SECTIONS.EDIT_PHOTO} icon={<PhotoCameraIcon className="icon" />} label="Photo" />
      <SidebarOption sectionKey={SECTIONS.CHANGE_CREDENTIALS} icon={<VpnKeyIcon className="icon" />} label="Change Email/Password" />
      <SidebarOption sectionKey={SECTIONS.SKILLS_PROJECTS} icon={<BuildIcon className="icon" />} label="Skills & Projects" />
      <SidebarOption sectionKey={SECTIONS.PRIVACY} icon={<SecurityIcon className="icon" />} label="Privacy and Security" />
      <SidebarOption sectionKey={SECTIONS.MY_POSTS} icon={<FeedIcon className="icon" />} label="My Posts" />
      <SidebarOption sectionKey={SECTIONS.SAVED} icon={<BookmarkSharpIcon className="icon" />} label="Saved" />

      {/* Logout */}
      <div className="sidebar-option logout" onClick={handleLogout}>
        <LogoutIcon className="icon" />
        <span>Logout</span>
      </div>
    </div>
  );
}