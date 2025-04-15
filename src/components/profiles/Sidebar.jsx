import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import BuildIcon from "@mui/icons-material/Build";
import SecurityIcon from "@mui/icons-material/Security";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import BookmarkSharpIcon from '@mui/icons-material/BookmarkSharp';
import FeedIcon from '@mui/icons-material/Feed';

// import "./Profile.css";

import './Sidebar.css'

export default function Sidebar() {
  return (
    <div className="sidebar-container">
        <div className="search-bar">
        <SearchSharpIcon className="search-icon" />
        <input type="text" placeholder="Search settings" />
      </div>
      <div className="sidebar-option">
        <AccountCircleIcon className="icon" />
        <span>View Public Profile</span>
      </div>
      <div className="sidebar-option">
        <EditIcon className="icon" />
        <span>Edit Profile</span>
      </div>
      <div className="sidebar-option">
        <PhotoCameraIcon className="icon" />
        <span>Photo</span>
      </div>
      <div className="sidebar-option">
        <VpnKeyIcon className="icon" />
        <span>Change Password</span>
      </div>
      <div className="sidebar-option">
        <BuildIcon className="icon" />
        <span>Skills & Projects</span>
      </div>
      <div className="sidebar-option">
        <SecurityIcon className="icon" />
        <span>Privacy and Security</span>
      </div>
      <div className="sidebar-option">
        <FeedIcon  className="icon" />
        <span>My Posts</span>
      </div>
      <div className="sidebar-option">
        <BookmarkSharpIcon className="icon" />
        <span>Saved</span>
      </div>
      <div className="sidebar-option logout">
        <LogoutIcon className="icon" />
        <span>Logout</span>
      </div>
    </div>
  );
}
